module.exports = {
    postCreateProduct: async (req, res) => {
        const { name, price, country, status, manufacturer, guaranteeTime, description, image } = req.body;
    },
};
