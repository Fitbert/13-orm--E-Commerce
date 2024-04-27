const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

// Get all tags
router.get('/', async (req, res) => {
  try {
    const allTags = await Tag.findAll({
      include: [
        {
          model: Product,
          attributes: ['id', 'product_name']
        }
      ]
    });
    return res.json(allTags);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Get a single tag by its ID
router.get('/:id', async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id, {
      include: [
        {
          model: Product,
          attributes: ['id', 'product_name']
        }
      ]
    });
    if (!tag) {
      res.status(404).json({ message: 'No tag found with this id' });
      return;
    }
    res.json(tag);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Create a new tag
router.post('/', (req, res) => {
  Tag.create(req.body)
    .then((tag) => {
      // If there are tagIds, create pairings in the ProductTag model
      if (req.body.tagIds && req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr)
          .then(() => res.status(201).json(tag));
      }
      res.status(201).json(tag);
    })
    .catch((err) => {
      console.error(err);
      res.status(400).json(err);
    });
});

// Update a tag's name by its ID
router.put('/:id', (req, res) => {
  Tag.update(req.body, {
    where: {
      id: req.params.id,
    },
    returning: true, // Ensure the updated tag is returned
  })
    .then(([rowsUpdated, [updatedTag]]) => {
      if (rowsUpdated === 0) {
        return res.status(404).json({ message: 'No tag found with this id' });
      }
      res.status(200).json(updatedTag);
    })
    .catch((err) => {
      console.error(err);
      res.status(400).json(err);
    });
});

// Delete a tag by its ID
router.delete('/:id', (req, res) => {
  Tag.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((tag) => {
      if (!tag) {
        return res.status(404).json({ error: 'Tag not found' });
      }
      res.status(200).json({ message: 'Tag deleted successfully' });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    });
});

module.exports = router;
