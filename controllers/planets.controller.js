const model = require('../models/Planets');
const utils = require('../helpers/utils');
const db = require('../helpers/db');

/** *******************
 * Private functions *
 ******************** */

const UNIQUEFIELDS = ['name'];

const itemExistsExcludingItself = async (id, body) =>
  new Promise((resolve, reject) => {
    const query = UNIQUEFIELDS.length > 0 ? {} : { noFields: true };
    for (const uniquefield of UNIQUEFIELDS) {
      query[uniquefield] = body[uniquefield];
    }
    query._id = {
      $ne: id,
    };
    model.findOne(query, (err, item) => {
      utils.itemAlreadyExists(err, item, reject, 'Este registro ya existe');
      resolve(false);
    });
  });

const itemExists = async (body) =>
  new Promise((resolve, reject) => {
    const query = UNIQUEFIELDS.length > 0 ? {} : { noFields: true };
    for (const uniquefield of UNIQUEFIELDS) {
      query[uniquefield] = body[uniquefield];
    }
    model.findOne(query, (err, item) => {
      utils.itemAlreadyExists(err, item, reject, 'Este registro ya existe');
      resolve(false);
    });
  });

/**
 * Gets all items from database
 */

const listAll = async (req, res) => {
  try {
    res.status(200).json(await db.getAllItems(model));
  } catch (error) {
    utils.handleError(res, error);
  }
};

const list = async (req, res) => {
  try {
    const query = await db.checkQueryString(req.query);
    res.status(200).json(await db.getItems(req, model, query));
  } catch (error) {
    utils.handleError(res, error);
  }
};

const getInRange = async (req, res) => {
  try {
    const { from, to } = req.query;
    let [galaxy, fromSystem] = from.split(':');
    let [, toSystem] = to.split(':');
    let planets = await model
      .find({
        galaxy,
        system: { $gte: fromSystem, $lte: toSystem },
        playerId: { $exists: true, $ne: null },
      })
      .sort({ system: 1, position: 1 });
    res.status(200).json({ ok: true, planets });
  } catch (error) {
    utils.handleError(res, error);
  }
};

const listOne = async (req, res) => {
  try {
    const id = await utils.isIDGood(req.params.id);
    res.status(200).json(await db.getItem(id, model));
  } catch (error) {
    utils.handleError(res, error);
  }
};

const create = async (req, res) => {
  try {
    req.body.userId = req.user._id;
    const doesItemExists = await itemExists(req.body);
    if (!doesItemExists) {
      res.status(200).json(await db.createItem(req.body, model));
    }
  } catch (error) {
    utils.handleError(res, error);
  }
};
const update = async (req, res) => {
  try {
    req.body.userId = req.user._id;
    const id = await utils.isIDGood(req.params.id);
    const doesItemExists = await itemExistsExcludingItself(id, req.body);
    if (!doesItemExists) {
      res.status(200).json(await db.updateItem(id, model, req.body));
    }
  } catch (error) {
    utils.handleError(res, error);
  }
};
const deletes = async (req, res) => {
  try {
    const id = await utils.isIDGood(req.params.id);
    res.status(200).json(await db.deleteItem(id, model));
  } catch (error) {
    utils.handleError(res, error);
  }
};
const getAlliances = async (req, res) => {
  try {
    const alliances = await model
      .aggregate([
        {
          $group: {
            _id: '$allianceName',
            docs: {
              $first: {
                alliancememberCount: '$alliancememberCount',
                allianceTag: '$allianceTag',
                highscorePositionAlliance: '$highscorePositionAlliance',
              },
            },
          },
        },
      ])
      .sort({ 'docs.highscorePositionAlliance': 1 });
    res.status(200).json({ ok: true, payload: alliances });
  } catch (error) {
    utils.handleError(res, error);
  }
};

module.exports = {
  list,
  listAll,
  listOne,
  create,
  update,
  deletes,
  getAlliances,
  getInRange,
};
