const { findAll, findById, save, deleteById } = require("../service");

const findAllController = async (req, res) => {
  const items = await findAll();
  return res.render("index", { items });
  // return res.status(200).json(items)
};

const findByIdController = async (req, res) => {
  const { id } = req.params;
  const item = id ? await findById(id) : null;
  return res.render("form", { item });
  // return res.status(200).json(item)
};

const saveController = async (req, res) => {
  try {
    await save(req.params.id, req.body, req.file);
    return res.redirect("/");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const deleteByIdController = async (req, res) => {
  try {
    await deleteById(req.params.id);
    return res.redirect("/");
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports = { findAllController, findByIdController, saveController, deleteByIdController };
