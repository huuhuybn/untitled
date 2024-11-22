var express = require('express');
var router = express.Router();
// MongoDB
// Cách kết nối, thao tác với MongoDB
const mongodb = 'mongodb+srv://admin:HgK4NhqvJrU5hdTe@cluster0.3vyc7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
const mongoose = require('mongoose')
mongoose.connect(mongodb, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    console.log("Connected to MongoDB")
}).catch(err => {
    console.log(err)
})

// query dữ liệu và hiển thị trên EJS
// Query dữ liệu và trả về JSON từ MongoDB
// ĐỊnh nghĩa 1 collection trước
// Schema là khái niệm để định nghĩa 1 Collection
// Collection tên là Student

const studentSCHEMA = new mongoose.Schema({
    name: String,
    address: String,
    phone: String,
})
// Model : là khái niệm để thao tác với Collection tên là Student
const STUDENT = mongoose.model('Student', studentSCHEMA)

router.get('/getDatabase', function (req, res) {
    STUDENT.find({}).then(result => {
        res.send(result)
    })
})
router.get('/createUser', function (req, res) {
    const random = Math.floor(Math.random() * 1000)
    const student = new STUDENT({
        name: "Huy Nguyen " + random,
        address: random + "Ha Noi ",
        phone: "" + random
    })
    student.save().then(result => {
        res.send(result)
    })
})

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express', message: "Hello World"});
});

router.get('/deleteUser', function (req, res) {
    const id = req.query.id
    STUDENT.deleteOne({_id: id}).then(result => {
        const ketqua = {
            errorCode: 200,
            message: "Delete user successfully"
        }
        res.send(ketqua)
    })
})

router.get('/getAllUser', function (req, res
) {
    // req : đối tượng chứa các tham số mà phía client gửi lên : trình duyệt, android, postman
    // res : đối tượng kiểm soát cách dữ liệu được trả về
    // trả về 1 file html , trả về 1 biến, trả về 1 array hay trả về 1 json data
    var jsonData = [{
        id: 1,
        name: "Nguyen Van A",
        age: 20
    },
        {
            id: 2,
            name: "Nguyen Van B",
            age: 20
        }, {
            id: 3,
            name: "Nguyen Van C",
            age: 20
        }
    ]
    res.send(jsonData)
})

router.get('/getAUser', function (req, res
) {
    // req : đối tượng chứa các tham số mà phía client gửi lên : trình duyệt, android, postman
    // res : đối tượng kiểm soát cách dữ liệu được trả về
    // trả về 1 file html , trả về 1 biến, trả về 1 array hay trả về 1 json data
    var jsonData = {
        id: 1,
        name: "Nguyen Van A",
        age: 20
    }
    res.send(jsonData)
})

router.get('/displayUsers', function (req, res) {
    // var jsonData = [{
    //     id: 1,
    //     name: "Nguyen Van A",
    //     age: 20
    // },
    //     {
    //         id: 2,
    //         name: "Nguyen Van B",
    //         age: 20
    //     }, {
    //         id: 3,
    //         name: "Nguyen Van C",
    //         age: 20
    //     }
    // ]
    STUDENT.find({}).then(jsonData => {
        // trả về 1 file html có tên là users trong thư mục views và truyền vào biến data
        res.render("users", {
            name: "Huy Nguyen",
            data: jsonData
        })
    })
})

router.get("/updateUser", function (req, res) {
    const id = req.query.id
    STUDENT.findOne({_id: id}).then(result => {
        console.log(JSON.stringify(result))
        res.render('updateForm', {data: result})
    })
})

router.post('/updateUser', function (req, res) {
    const id = req.body.id
    const name = req.body.name
    const address = req.body.address
    const phone = req.body.phone
    console.log(id)
    STUDENT.updateOne({_id: id},
        {name: name, address: address, phone: phone}).then(result => {
        res.redirect('/displayUsers')
    }).catch(err => {
        console.log(err)
    })
})

router.post('/createUser', function (req,
                                     res) {
    // Thuộc tính sau biến body là thuộc tính trong thẻ input
    // , gia trị của thuộc tính name
    // ví dụ :
    // <input name="name">
    // <input name="age">
    const name = req.body.name;
    const age = req.body.age;
    const random = Math.floor(Math.random() * 1000)
    const student = new STUDENT({
        name: name,
        address: random + "Ha Noi ",
        phone: age
    })
    student.save().then(result => {
        // res.render('index', {title: "Created User", message: "Create user successfully"})
        //res.redirect('/displayUsers')
        const ketqua = {
            errorCode: 200,
            message: "Create user successfully",
        }
        res.send(ketqua)
    }).catch(err => {
        console.log(err)
        const ketqua = {
            errorCode: 500,
            message: "Create user fail",
        }

        res.send(ketqua)
    })
})
module.exports = router;
