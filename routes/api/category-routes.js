const router = require('express').Router();
const { Category, Product, Tag } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  try {
    const allCategories = await Category.findAll(); // Remove the include option
    return res.json(allCategories);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }

});

router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id); // Remove the include option
    if (!category) {
      res.status(404).json({ message: 'No category found with this id' });
      return;
    }
    
    res.json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.post('/', (req, res) => {
  // create a new category
  Category.create(req.body)
    .then((category) => {
      res.status(200).json(category);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.put('/:id', (req, res) => {
  Category.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((result) => {
      if (result[0] === 0) {
        return res.status(404).json({ message: 'No category found with this id' });
      }
      res.status(200).json({ message: 'Category updated successfully' });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    });
});

router.delete('/:id', (req, res) => {
  Category.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((result) => {
      if (result === 0) {
        return res.status(404).json({ message: 'No category found with this id' });
      }
      res.status(200).json({ message: 'Category deleted successfully' });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    });
});

module.exports = router;
