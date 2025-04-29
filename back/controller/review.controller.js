const reviews = require('../models/review.modal');

exports.createNewreviews = async (req, res) => {
    try {
        let { rating, trouble, comments, userId } = req.body;

        let chekreviews = await reviews.create({
            userId,
            rating,
            trouble,
            comments
        });

        return res.json({ status: 200, message: "Reviews Submitted....", reviews: chekreviews });

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.getAllreviews = async (req, res) => {
    try {
        let paginatedreviews;

        // paginatedreviews = await reviews.find()
        paginatedreviews = await reviews.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userData'
                }
            }
        ]);

        let count = paginatedreviews.length;

        if (count === 0) {
            return res.json({ status: 400, message: "reviews Not Found" })
        }

        return res.json({ status: 200, totalreviewss: count, message: "All reviews Found SuccessFully", reviews: paginatedreviews })

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.getreviewsById = async (req, res) => {
    try {
        let id = req.params.id

        let reviewsFindById = await reviews.findById(id);

        if (!reviewsFindById) {
            return res.json({ status: 400, message: "reviews Not Found" })
        }

        return res.json({ status: 200, message: "reviews Found SuccessFully", reviews: reviewsFindById })

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.updatereviews = async (req, res) => {
    try {
        let id = req.params.id
        let reviewsData = req.body;
        let reviewsUpdateById = await reviews.findById(id);

        if (!reviewsUpdateById) {
            return res.json({ status: 400, message: "reviews Not Found" })
        }

        reviewsUpdateById = await reviews.findByIdAndUpdate(id, { ...reviewsData }, { new: true });

        return res.json({ status: 200, message: "reviews Updated SuccessFully", reviews: reviewsUpdateById });
    }
    catch (error) {
        console.log(error);
        res.json({ status: 500, message: error.message });
    }
};

exports.removereviews = async (req, res) => {
    try {
        let id = req.params.id

        let removereviews = await reviews.findById(id);

        if (!removereviews) {
            return res.json({ status: 400, message: "reviews Not Found" })
        }

        await reviews.findByIdAndDelete(id);

        return res.json({ status: 200, message: "reviews Deleted SuccessFully" })

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
}