const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const { User } = require('../models');
const getCoordinates = require('../services/getCoordinates');
const ApiError = require('../errors/apiError');
const redis = require('../config/redis');

const auth = {

  generateToken(user) {
    return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: `${process.env.JWT_EXPIRE}s` });
  },

  generateCookie(res, name, value) {
    res.cookie(name, value, {
      httpOnly: true,
      signed: true,
      secret: process.env.COOKIE_SECRET,
    });
  },

  async register(req, res) {
    const {
      nickname, city, email, password,
    } = req.body;

    const isUserExist = await User.findOne({
      where: {
        email,
      },
    });

    if (isUserExist) {
      throw new ApiError('Cet utilisateur existe déjà', 400);
    }

    delete req.body.confirmPassword;

    const hashPassword = await argon2.hash(password);

    const coordinates = await getCoordinates(city);

    let createdUser = await User.create(
      {
        email,
        password: hashPassword,
        nickname,
        city,
        lat: coordinates[0],
        long: coordinates[1],
        url: '',
      },

    );

    createdUser = createdUser.get();

    const userToken = {
      id: createdUser.id,
      lat: createdUser.lat,
      long: createdUser.long,
      is_admin: createdUser.is_admin,
    };

    const token = auth.generateToken(userToken);

    auth.generateCookie(res, 'token', token);

    delete createdUser.password;

    res.json(createdUser);
  },

  async login(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: {
        email,
      },

      raw: true,
    });

    if (!user) {
      throw new ApiError('Utilisateur introuvable', 400);
    }

    const isGoodPassword = await argon2.verify(user.password, password);

    if (!isGoodPassword) {
      throw new ApiError('Email ou mot de passe incorrect', 400);
    }

    const userToken = {
      id: user.id,
      lat: user.lat,
      long: user.long,
      is_admin: user.is_admin,
    };

    const token = auth.generateToken(userToken);

    auth.generateCookie(res, 'token', token);

    delete user.password;

    const val = { ...user, url: `http://localhost:8080/api/user/${user.id}/avatar` };

    console.log(val);
    res.json(val);
  },

  async logout(req, res) {
    const { token } = req.signedCookies;

    if (!token) {
      throw new ApiError('Aucun token existant', 500);
    }

    await redis.set(token, token);
    redis.expire(token, process.env.JWT_EXPIRE);

    res.clearCookie('token');

    res.json({ msg: 'déconnecté' });
  },
};

module.exports = auth;
