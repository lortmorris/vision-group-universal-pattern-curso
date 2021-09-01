
function sales(upInstance) {
  const {
    services,
    db,
  } = upInstance;

  upInstance.registerController('sales.insert', async (req, res, next) => {
    const {
      userId,
      products,
    } = req.swagger.params.modeldata.value;

    try {
      const userExists = await services.findOne('/users', { _id: db.ObjectId(userId) });
      if (!userExists) {
        return res.status(500).end('Invalid userId');
      }

      let finalPrice = 0;
      const tasks = products.map(async (product) => {
        const productInfo = await services.findOne('/products', { _id: db.ObjectId(product) });
        if (!productInfo) return Promise.reject('Invalid productId');
        finalPrice += productInfo.price;
        return productInfo
      });

      const productData = await Promise.all(tasks);
      console.info('data input: ', userId, products);
      const newSale = await services.insert('/sales', {
        user: {
          firstname: userExists.firstname,
          lastname: userExists.lastname,
          email: userExists.email,
          _id: String(userExists._id),
        },
        products: [...productData],
        finalPrice,
      });
      res.json(newSale);
    } catch (err) {
      console.error(err);
      return res.status(500).end('Internal error');
    }
  });
}

module.exports = sales;
