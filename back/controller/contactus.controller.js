const contact = require('../models/contactus.model');

exports.createNewcontact = async (req, res) => {
    try {
        let { firstname, lastname, email, phoneno, message } = req.body;

        let chekcontact = await contact.create({
            firstname,
            lastname,
            email,
            phoneno,
            message
        });

        return res.json({ status: 200, message: "contact Created Successfully", contact: chekcontact });

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.getAllcontact = async (req, res) => {
    try {
        let paginatedcontact;

        paginatedcontact = await contact.find()

        let count = paginatedcontact.length;

        if (count === 0) {
            return res.json({ status: 400, message: "contact Not Found" })
        }

        return res.json({ status: 200, totalcontacts: count, message: "All contact Found SuccessFully", contact: paginatedcontact })

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.getcontactById = async (req, res) => {
    try {
        let id = req.params.id

        let contactFindById = await contact.findById(id);

        if (!contactFindById) {
            return res.json({ status: 400, message: "contact Not Found" })
        }

        return res.json({ status: 200, message: "contact Found SuccessFully", contact: contactFindById })

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.updatecontact = async (req, res) => {
    try {
        let id = req.params.id
        let contactUpdateById = await contact.findById(id);

        if (!contactUpdateById) {
            return res.json({ status: 400, message: "contact Not Found" })
        }

        contactUpdateById = await contact.findByIdAndUpdate(id, { ...contactData }, { new: true });

        return res.json({ status: 200, message: "contact Updated SuccessFully", contact: contactUpdateById });
    }
    catch (error) {
        console.log(error);
        res.json({ status: 500, message: error.message });
    }
};

exports.removecontact = async (req, res) => {
    try {
        let id = req.params.id

        let removecontact = await contact.findById(id);

        if (!removecontact) {
            return res.json({ status: 400, message: "contact Not Found" })
        }

        await contact.findByIdAndDelete(id);

        return res.json({ status: 200, message: "contact Deleted SuccessFully" })

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
}
