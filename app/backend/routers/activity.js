const router = require('express').Router();
const activityController = require('../controllers/activityController');
const validator = require('../validation/validator');
const commentValidator = require('../validation/schema/comment');
const controllerHandler = require('../helpers/controllerHandler');

/**
 * @swagger
 *
 *  components:
 *    schemas:
 *      Activity:
 *        type: object
 *        required:
 *          - name
 *          - description
 *          - date
 *          - address
 *          - city
 *          - lat
 *          - long
 *          - user_id
 *        properties:
 *          id:
 *            type: integer
 *            description: The id of the activity
 *            required: true
 *          name:
 *            type: string
 *            description: The name of the activity
 *          description:
 *            type: string
 *            description: The description of the activity
 *          date:
 *            type: string
 *            description: The date of the activity
 *          city:
 *            type: string
 *            description: The city of the activity
 *          lat:
 *            type: string
 *            description: The latitude of the activity address
 *          long:
 *            type: string
 *            description: The longitude of the activity address
 *          user_id:
 *            type: integer
 *            description: ID of the user who created the activity
 */

/**
 * @swagger
 * tags:
 *   name: /activity
 *   description: Acitivity routes
 */

/**
 * @swagger
 * /api/activity:
 *    get:
 *      summary: Retrieves all activities
 *      tags: [/activity]
 *      responses:
 *        '200':
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Activity'
 *        '403':
 *          description: Forbidden
 *        '500':
 *          description: Internal server error.
 */

router.route('/').get(controllerHandler(activityController.getActivities)); // Gets all activities

/**
 * @swagger
 * /api/activity/{activityId}:
 *    get:
 *      summary: Retrieves one activity by id
 *      tags: [/activity]
 *      parameters:
 *        - in: path
 *          name: activityId
 *          schema:
 *            type: integer
 *          required: true
 *          description: ID of the activity to get
 *      responses:
 *        '200':
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Activity'
 *        '403':
 *          description: Forbidden
 *        '500':
 *          description: Internal server error.
 */

router
  . route('/comments')
  .get(controllerHandler(activityController.getComments));

router.route('/:id').get(controllerHandler(activityController.getActivity)); // Gets one activity

router
  .route('/:activityId/comment')
  .post(validator('body', commentValidator), controllerHandler(activityController.createComment)); // Posts one comment on one activity

router
  .route('/:userId/participate')
  .get(controllerHandler(activityController.getParticipations))
  .post(controllerHandler(activityController.participateToActivity));

router
  .route('/sse/participate/:city')
  .get(controllerHandler(activityController.getParticipationsInRealTime));

router
  .route('/sse/comments/')
  .get(controllerHandler(activityController.getCommentsSSE));

module.exports = router;
