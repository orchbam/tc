const express = require('express'); // ใช้งาน module express
const path = require('path'); // ใช้งาน module path
const cookieSession = require('cookie-session'); // ใช้งาน module cookieSession
const bcrypt = require('bcrypt'); // ใช้งาน module bcrypt ไว้เข้ารหัสผ่าน
const dbConnection = require('./database');  // ใช้งาน module database ฐานข้อมูล
const { body, validationResult } = require('express-validator'); // ใช้งาน module express-validator 

const app = express(); // สร้างตัวแปร app เป็น instance ของ express app หรือ เรียกใช้งาน express
app.use(express.urlencoded({extended:false})); // เซ็ท urlencoded extended เป็น false // urlencoded  ใช้สำหรับแปลงข้อมูลจาก form ในรูปแบบ url encode เป็น Object

// กำหนด “view engine” เป็น “ejs”
app.set('views', path.join(__dirname,'views'));
app.set('view engine','ejs');

// เก็บ CookieSession
app.use(cookieSession({  // เรียกใช้ CookieSession
    name: 'session', // ตั้งชื่อว่า session
    keys: ['key1', 'key2'], // ตั้ง key1 กับ key2
    maxAge:  3600 * 1000 //3600 * 1000 = 1 ชั่วโมง อายุของ cookie // ถ้าล็อคอินเกิน 1 ชั่วโมง มันจะล็อคเอ้าท์เอง
}));

app.use(express.static("public")); // เรียกใช้โฟลเดอร์ public
app.use('/css',express.static(__dirname + 'public/css')) // เรียกใช้โฟลเดอร์ css
app.use('/css',express.static(__dirname + 'public/image')) // เรียกใช้โฟลเดอร์ image




// โยงไปหน้าต่างๆ //
app.get('/home', function(req, res, next) {
    res.render('home');
});

app.get('/about', function(req, res, next) {
    res.render('about');
});

app.get('/contact', function(req, res, next) {
    res.render('contact');
});

app.get('/group', function(req, res, next) {
    res.render('group');
});  

app.get('/register', function(req, res, next) {
    res.render('register');
});

app.get('/service', function(req, res, next) {
    res.render('service');
});

app.get('/pay', function(req, res, next) {
    res.render('pay');
});

app.get('/jobprofile', function(req, res, next) {
    res.render('jobprofile');
});

app.get('/jobregis', function(req, res, next) {
    res.render('jobregis');
});
  
app.get('/joblogin', function(req, res, next) {
    res.render('joblogin');
});

app.get('/finpay', function(req, res, next) {
    res.render('finpay');
});  
  



app.get('/rodnam', function(req, res, next) {
    res.render('rodnam');
  });
  app.get('/rodnam',(req,res) => {
    res.render('rodnam', {data:{} }); // ผูกกับหน้าเพื่อแสดงผล
});

app.get('/transpot', function(req, res, next) {
    res.render('transpot');
  });
  app.get('/transpot',(req,res) => {
    res.render('transpot', {data:{} }); 
});
  
app.get('/pay2', function(req, res, next) {
    res.render('pay2');
  });
  app.get('/pay2',(req,res) => {
    res.render('pay2', {data:{} }); 
});
  
app.get('/kratu', function(req, res, next) {
    res.render('kratu');
  });
  app.get('/kratu',(req,res) => {
    res.render('kratu', {data:{} }); 
});
  
app.get('/repair', function(req, res, next) {
    res.render('repair');
  });
  app.get('/repair',(req,res) => {
    res.render('repair', {data:{} }); 
});
  
app.get('/working', function(req, res, next) {
    dbConnection.execute('SELECT * FROM rodnam WHERE active = ?',[req.session.name]).then(([row]) => {
        dbConnection.execute('SELECT * FROM transpot WHERE active = ?',[req.session.name]).then(([rows]) => {
            dbConnection.execute('SELECT * FROM repair WHERE active = ?',[req.session.name]).then(([rowi]) => {
                dbConnection.execute('SELECT * FROM kratu WHERE active = ?',[req.session.name]).then(([rowz]) => {

                     res.render('working', { data: row , data2: rows , data3: rowi , data4: rowz });
                }) 
            }) 

        })      
    })
});  




// หน้า logout
app.get('/logout',(req,res)=>{
    req.session = null; // ล้างข้อมูลเซสชั่น
    res.redirect('/'); // เปลี่ยน path ไปยัง url ที่กำหนด 
});
// จบหน้า LOGOUt
  

// DECLARING CUSTOM MIDDLEWARE
const ifNotLoggedin = (req, res, next) => { // ถ้าไม่มีล็อคอิน รับ request,response,next
    if(!req.session.isLoggedIn){ // ถ้าไม่มีล็อคอิน
        return res.render('login-register'); // กลับไปหน้า login-register 
    }
    next();
}

const ifLoggedin = (req,res,next) => { // ถ้ามี ล็อคอิน รับ request,response,next
    if(req.session.isLoggedIn){ // ถ้ามี ล็อคอิน
        return res.redirect('/home'); // กลับไปหน้า home
    }
    next();
}
const ifNotLoggedin2 = (req, res, next) => { // ถ้าไม่มีล็อคอิน รับ request,response,next
    if(!req.session.isLoggedIn2){ // ถ้าไม่มีล็อคอิน
        return res.render('/joblogin'); // กลับไปหน้า login-register 
    }
    next();
}

const ifLoggedin2 = (req,res,next) => { // ถ้ามี ล็อคอิน รับ request,response,next
    if(req.session.isLoggedIn2){ // ถ้ามี ล็อคอิน
        return res.redirect('/job'); // กลับไปหน้า home
    }
    next();
}


//                               END OF CUSTOM MIDDLEWARE

app.get('/job',ifNotLoggedin2, function(req, res, next) {
    dbConnection.execute('SELECT * FROM rodnam WHERE active = ?',['free']).then(([row]) => {
        dbConnection.execute('SELECT * FROM transpot WHERE active = ?',['free']).then(([rows]) => {
            dbConnection.execute('SELECT * FROM repair WHERE active = ?',['free']).then(([rowi]) => {
                dbConnection.execute('SELECT * FROM kratu WHERE active = ?',['free']).then(([rowz]) => {

                     res.render('job', { data: row , data2: rows , data3: rowi , data4: rowz });
                }) 
            }) 

        })      
    })
});

// update book page
app.get('/accept/:id', (req, res, next) => {
    let id = req.params.id;
    dbConnection.execute("SELECT firstname FROM partners WHERE id = ?",[req.session.userID]).then(([rows]) => { 
        let name = rows[0].firstname;
       dbConnection.execute("UPDATE rodnam SET active = ? WHERE id = " + [id],[name]).then(([]) => {
            res.redirect('/job');   
            })
        });     
})

app.get('/accept2/:id', (req, res, next) => {
    let id = req.params.id;
    dbConnection.execute("SELECT firstname FROM partners WHERE id = ?",[req.session.userID]).then(([rows]) => { 
        let name = rows[0].firstname;
       dbConnection.execute("UPDATE transpot SET active = ? WHERE id = " + [id],[name]).then(([]) => {
            res.redirect('/job');   
            })
        });     
})

app.get('/accept3/:id', (req, res, next) => {
    let id = req.params.id;
    dbConnection.execute("SELECT firstname FROM partners WHERE id = ?",[req.session.userID]).then(([rows]) => { 
        let name = rows[0].firstname;
       dbConnection.execute("UPDATE repair SET active = ? WHERE id = " + [id],[name]).then(([]) => {
            res.redirect('/job');   
            })
        });     
})

app.get('/accept4/:id', (req, res, next) => {
    let id = req.params.id;
    dbConnection.execute("SELECT firstname FROM partners WHERE id = ?",[req.session.userID]).then(([rows]) => { 
        let name = rows[0].firstname;
       dbConnection.execute("UPDATE kratu SET active = ? WHERE id = " + [id],[name]).then(([]) => {
            res.redirect('/job');   
            })
        });     
})





// ROOT PAGE
app.get('/', ifNotLoggedin, (req,res,next) => { // เรียก app.get หน้าแรกจะใช้ "/" ------- เรียกใช้ ifNotLoggedin ด้วยเพื่อเช็คล็อคอิน
    dbConnection.execute("SELECT `name` FROM `users` WHERE `id`=?",[req.session.userID]) //เชื่อมต่อกับฐานข้อมูล ตรงพวก SELECT เป็นคำสั่งของ SQL PHPMYADMIN เพื่อไปเรียก name จากตาราง user ตามด้วย id แทนค่าไอดีด้วย ? 
    .then(([rows]) => { // แล้วเช็ค ตาราง
        res.render('home',{ // render หน้า home
            name:rows[0].name // ดึงข้อมูลจาก rows index 0  ตามด้วยชื่อจาก ตาราง
        });
    });
    
});// END OF ROOT PAGE

// สร้างการ route แบบ post เพื่อรับข้อมูลลงฐานข้อมูล
app.post('/rodnam',(req, res) => {
    const {rm_date,rm_address,rm_treetype,rm_treeq} = req.body;
    console.log(rm_date,rm_address,rm_treetype,rm_treeq);
    dbConnection.execute("INSERT INTO rodnam (date,address,treetype,treeq,active) VALUES(?,?,?,?,'free')",[rm_date,rm_address,rm_treetype,rm_treeq]).then(([]) =>{
       console.log('success insert');
    res.redirect('pay');
    })
});
  

app.post('/transpot',(req, res) => {
    const {tp_start, tp_address, tp_destination, tp_address2, tp_date, tp_rate} = req.body;
    console.log(tp_start, tp_address, tp_destination, tp_address2, tp_date, tp_rate);
    dbConnection.execute("INSERT INTO transpot (start,address,destination,address2,date,rate,active) VALUES(?,?,?,?,?,?,'free')",[tp_start, tp_address, tp_destination, tp_address2, tp_date, tp_rate]).then(([]) =>{
       console.log('success insert');
    res.redirect('pay');
    })
});

app.post('/repair',(req, res) => {
    const {rp_province, rp_address, rp_treetype, rp_treesick, rp_date, rp_rate} = req.body;
    console.log(rp_province, rp_address, rp_treetype, rp_treesick, rp_date, rp_rate);
    dbConnection.execute("INSERT INTO repair (province, rp_address,rp_treetype,treesick,date,rate,active) VALUES(?,?,?,?,?,?,'free')",[rp_province, rp_address, rp_treetype, rp_treesick, rp_date, rp_rate]).then(([]) =>{
       console.log('success insert');
       res.redirect('pay');
    })
});

app.post('/kratu',(req, res) => {
    const {kt_typeproblem,kt_problem,kt_tel,kt_rate} = req.body;
    console.log(kt_typeproblem,kt_problem,kt_tel,kt_rate);
    dbConnection.execute("INSERT INTO kratu (typeproblem,problem,tel,rate,active) VALUES(?,?,?,?,'free')",[kt_typeproblem,kt_problem,kt_tel,kt_rate]).then(([]) =>{
       console.log('success insert');
       res.redirect('pay'); 
    })
});

app.post('/pay2',(req, res) => {
    const {p_date,p_time,p_bank,p_accnum,p_amount,s_sel,l_line} = req.body;
    console.log(p_date,p_time,p_bank,p_accnum,p_amount,s_sel,l_line);
    dbConnection.execute("INSERT INTO detailpay (p_date,p_time,p_bank,p_accnum,p_amount,s_sel,l_line) VALUES(?,?,?,?,?,?,?)",[p_date,p_time,p_bank,p_accnum,p_amount,s_sel,l_line]).then(([]) =>{
        res.redirect('finpay');    
    })   
});  




//หน้าลงทะเบียนผู้ให้บริการ
app.post('/jobregis', ifLoggedin2, 
[
    body('part_jmail','Invalid email address!').isEmail().custom((value) => { //เรียกใช้ฟังชั่น body จาก express-validator ---  รับค่า value มา เช็ค Email จาก user_email ว่า Email ถูกต้องไหมเช่น abc@hotmail.com ไม่ใช่ abc@ เฉยๆ
        return dbConnection.execute('SELECT `email` FROM `partners` WHERE `email`=?', [value]) // เช็คฐานข้อมูลใน email ว่ามีอยู่แล้วไหม
        .then(([rows]) => { 
            if(rows.length > 0){ // ถ้ามีอีเมล์อยู่แล้ว
                return Promise.reject('This E-mail already in use!'); // แจ้งเตือนมีคนใช้อีเมล์แล้ว
            }
            return true;
        });
    }),
    body('part_fname','Firstname is Empty!').trim().not().isEmpty(),
    body('part_lname','Lastname is Empty!').trim().not().isEmpty(),
    body('part_tel','Tel is Empty!').trim().not().isEmpty(),// เช็ค user_name ถ้ามันว่าง จะขึ้นแจ้งเตือน trim คือตัดช่องว่าง
    body('part_jpass','The password must be of minimum length 6 characters').trim().isLength({ min: 6 }), // เช็ค user_pass ว่า รหัสผ่านต้องมี 6 ตัวอักษร อย่างต่ำ trim คือตัดช่องว่าง
],// จบการเช็คข้อมูลผิดพลาด
(req,res,next) => {
    const validation_result = validationResult(req); // สร้างตัวแปรชื่อ validation_result และเรียกใช้ validationResult และ ส่ง request object 
    const {part_fname,part_lname,part_tel,part_jmail,part_jpass} = req.body; // ดึงพวก user_name , pass , email มาจาก req.body 
    // IF validation_result HAS NO ERROR
    if(validation_result.isEmpty()){ // ถ้า validation_result ว่าง
        // password encryption (using bcryptjs)
        bcrypt.hash(part_jpass, 12).then((hash_jpass) => { // เข้ารหัส hash user_pass parameter 12 *เข้ารหัสเพื่อ กัน Hack กันล้วงข้อมูล
            // INSERTING USER INTO DATABASE
            dbConnection.execute("INSERT INTO `partners`(`firstname`,`lastname`,`tel`,`email`,`password`) VALUES(?,?,?,?,?)",[part_fname,part_lname,part_tel,part_jmail,hash_jpass]) // insert เพิ่มข้อมูลลงในฐานข้อมูล
            .then(result => {
                res.send(`your account has been created successfully, Now you can <a href="/joblogin">Login</a>`); // แจ้งว่าสมัครสมาชิกสำเร็จ
            }).catch(err => { // เช็คถ้ามัน error
                // THROW INSERTING USER ERROR'S
                if (err) throw err; // ส่งข้อความ error
            });
        })
        .catch(err => { // เช็คถ้ามัน error
            if (err) throw err; // ส่งข้อความ error
        })
    }
    else{ // เช็ค else อีกรอบ กรณีมีข้อผิดพลาด
        let allErrors = validation_result.errors.map((error) => { // สร้างตัวแปรชื่อ allErrors ใช้ validation_result map เข้าถึง error ทุกตัว
            return error.msg; // ส่งข้อความ error ออกมา
        });
        res.render('joblogin',{ // render หน้า login-register
            register_error:allErrors, // ส่ง allerror
            old_data:req.body // ข้อมูลเก่า ส่ง req.body
        });
    }
});// จบหน้า REGISTER 


//หน้าล็อคอินผู้ให้บริการ
app.post('/joblogin', ifLoggedin2, [ 
    body('part_jmail').custom((value) => { // เรียกใช้ body เช็ค email รับ value มา
        return dbConnection.execute('SELECT email FROM partners WHERE email=?', [value]) //เช็คใน ฐานข้อมูล
        .then(([rows]) => { // เช็คใน ตาราง
            if(rows.length == 1){ // ถ้ามันตรงกัน
                return true; // return True
                
            } // ถ้านอกเหนือจากนี้
            return Promise.reject('Invalid Email Address!'); // แจ้งว่า Email ผิด
            
        });
    }),
    body('part_jpass','Password is empty!').trim().not().isEmpty(), // เช็ค user_pass ถ้ามัน ว่าง แจ้งว่ามันว่าง trim ตัดช่องว่าง
], (req, res) => {
    const validation_result = validationResult(req); // เรียกใช้ validation_result
    const {part_jmail, part_jpass} = req.body; // เรียกใช้ user , pass , email จาก body
    if(validation_result.isEmpty()){ // เช็คถ้ามันว่าง
        
        dbConnection.execute("SELECT * FROM `partners` WHERE `email`=?",[part_jmail]) // เลือกข้อมูลจาก email
        .then(([rows]) => {
            bcrypt.compare(part_jpass, rows[0].password).then(compare_result => { // compare เปรียบเทียบ รหัสที่รับเข้ามาตรงกับ รหัสในฐานข้อมูลไหม
                if(compare_result === true){ // ถ้ามันตรงกัน
                    req.session.isLoggedIn2 = true; // เก็บค่า req.session.isLoggedIn = true
                    req.session.userID = rows[0].id; // เก็บ session userID
                    req.session.name = rows[0].firstname;
                    res.redirect('/job'); // ไปหน้า job
                }
                else{ // ถ้ามันผิดพลาด
                    res.render('joblogin',{ // กลับไปหน้า login-register
                        login_errors:['Invalid Password!'] // ส่งข้อความ error 
                    });
                }
            })
            .catch(err => {
                if (err) throw err;
            });


        }).catch(err => {
            if (err) throw err;
        });
    }
    else{
        let allErrors = validation_result.errors.map((error) => {
            return error.msg;
        });
        // REDERING login-register PAGE WITH LOGIN VALIDATION ERRORS
        res.render('joblogin',{
            login_errors:allErrors
        });
    }
});



// หน้าลงเบียนผู้ใช้บริการ
app.post('/register', ifLoggedin, 
// post data เช็คข้อมูลผิดพลาด ใช้ express-validator
[
    body('user_email','Invalid email address!').isEmail().custom((value) => { //เรียกใช้ฟังชั่น body จาก express-validator ---  รับค่า value มา เช็ค Email จาก user_email ว่า Email ถูกต้องไหมเช่น abc@hotmail.com ไม่ใช่ abc@ เฉยๆ
        return dbConnection.execute('SELECT `email` FROM `users` WHERE `email`=?', [value]) // เช็คฐานข้อมูลใน email ว่ามีอยู่แล้วไหม
        .then(([rows]) => { 
            if(rows.length > 0){ // ถ้ามีอีเมล์อยู่แล้ว
                return Promise.reject('This E-mail already in use!'); // แจ้งเตือนมีคนใช้อีเมล์แล้ว
            }
            return true;
        });
    }),
    body('user_name','Username is Empty!').trim().not().isEmpty(), // เช็ค user_name ถ้ามันว่าง จะขึ้นแจ้งเตือน trim คือตัดช่องว่าง
    body('user_pass','The password must be of minimum length 6 characters').trim().isLength({ min: 6 }), // เช็ค user_pass ว่า รหัสผ่านต้องมี 6 ตัวอักษร อย่างต่ำ trim คือตัดช่องว่าง
],// จบการเช็คข้อมูลผิดพลาด
(req,res,next) => {
    const validation_result = validationResult(req); // สร้างตัวแปรชื่อ validation_result และเรียกใช้ validationResult และ ส่ง request object 
    const {user_name, user_pass, user_email} = req.body; // ดึงพวก user_name , pass , email มาจาก req.body 
    // IF validation_result HAS NO ERROR
    if(validation_result.isEmpty()){ // ถ้า validation_result ว่าง
        // password encryption (using bcryptjs)
        bcrypt.hash(user_pass, 12).then((hash_pass) => { // เข้ารหัส hash user_pass parameter 12 *เข้ารหัสเพื่อ กัน Hack กันล้วงข้อมูล
            // INSERTING USER INTO DATABASE
            dbConnection.execute("INSERT INTO `users`(`name`,`email`,`password`) VALUES(?,?,?)",[user_name,user_email, hash_pass]) // insert เพิ่มข้อมูลลงในฐานข้อมูล
            .then(result => {
                res.send(`your account has been created successfully, Now you can <a href="/">Login</a>`); // แจ้งว่าสมัครสมาชิกสำเร็จ
            }).catch(err => { // เช็คถ้ามัน error
                // THROW INSERTING USER ERROR'S
                if (err) throw err; // ส่งข้อความ error
            });
        })
        .catch(err => { // เช็คถ้ามัน error
            if (err) throw err; // ส่งข้อความ error
        })
    }
    else{ // เช็ค else อีกรอบ กรณีมีข้อผิดพลาด
        let allErrors = validation_result.errors.map((error) => { // สร้างตัวแปรชื่อ allErrors ใช้ validation_result map เข้าถึง error ทุกตัว
            return error.msg; // ส่งข้อความ error ออกมา
        });
        res.render('login-register',{ // render หน้า login-register
            register_error:allErrors, // ส่ง allerror
            old_data:req.body // ข้อมูลเก่า ส่ง req.body
        });
    }
});// จบหน้า REGISTER 


 
// หน้า login ผู้ใช้บริการ
app.post('/', ifLoggedin, [ 
    body('user_email').custom((value) => { // เรียกใช้ body เช็ค email รับ value มา
        return dbConnection.execute('SELECT email FROM users WHERE email=?', [value]) //เช็คใน ฐานข้อมูล
        .then(([rows]) => { // เช็คใน ตาราง
            if(rows.length == 1){ // ถ้ามันตรงกัน
                return true; // return True
                
            } // ถ้านอกเหนือจากนี้
            return Promise.reject('Invalid Email Address!'); // แจ้งว่า Email ผิด
            
        });
    }),
    body('user_pass','"Password is empty!').trim().not().isEmpty(), // เช็ค user_pass ถ้ามัน ว่าง แจ้งว่ามันว่าง trim ตัดช่องว่าง"
], (req, res) => {
    const validation_result = validationResult(req); // เรียกใช้ validation_result
    const {user_pass, user_email} = req.body; // เรียกใช้ user , pass , email จาก body
    if(validation_result.isEmpty()){ // เช็คถ้ามันว่าง
        
        dbConnection.execute("SELECT * FROM `users` WHERE `email`=?",[user_email]) // เลือกข้อมูลจาก email
        .then(([rows]) => {
            bcrypt.compare(user_pass, rows[0].password).then(compare_result => { // compare เปรียบเทียบ รหัสที่รับเข้ามาตรงกับ รหัสในฐานข้อมูลไหม
                if(compare_result === true){ // ถ้ามันตรงกัน
                    req.session.isLoggedIn = true; // เก็บค่า req.session.isLoggedIn = true
                    req.session.userID = rows[0].id; // เก็บ session userID

                    res.redirect('/'); // กลับไปที่หน้าแรก
                }
                else{ // ถ้ามันผิดพลาด
                    res.render('login-register',{ // กลับไปหน้า login-register
                        login_errors:['Invalid Password!'] // ส่งข้อความ error 
                    });
                }
            })
            .catch(err => {
                if (err) throw err;
            });


        }).catch(err => {
            if (err) throw err;
        });
    }
    else{
        let allErrors = validation_result.errors.map((error) => {
            return error.msg;
        });
        // REDERING login-register PAGE WITH LOGIN VALIDATION ERRORS
        res.render('login-register',{
            login_errors:allErrors
        });
    }
});
    




app.listen(3000, () => console.log("Server is Running..."));//Start Server ที่ localhost Port 3000 
