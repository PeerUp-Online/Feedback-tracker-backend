const GetAllProducts = (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Your password is changed',
        response: {
            name: 'Sidharth',
        },
    })
}

module.exports = { GetAllProducts }
