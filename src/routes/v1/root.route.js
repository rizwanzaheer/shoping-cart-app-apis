const express = require('express');

const router = express.Router();

router.route('/').get((req, res, next) => {
  res.json({ msg: 'Welcome to Order24 Assignment APIs' });
});

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Root API
 *   description: To Check the API is alive or not.
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get root API info
 *     description: To Check the API is alive or not.
 *     tags: [Root API]
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: integer
 *                   example: Welcome to Order24 Assignment APIs
 */
