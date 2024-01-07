const user = require("./db").db_user
const { ObjectId } = require("mongodb");
const { RecaptchaEnterpriseServiceClient } = require('@google-cloud/recaptcha-enterprise');


async function recaptcha(req, res, next) {

    console.log(req.body)
    // TO-DO: Replace the token and reCAPTCHA action variables before running the sample.
    const projectID = "aflozz-1704543717653"
    const recaptchaKey = "6LfQp0gpAAAAANR-Wx25alF9QN32fN92tm_9PIr7"
    const token = req.body?.token
    const recaptchaAction = req.body?.action
    // createAssessment(projectID,recaptchaKey,token,recaptchaAction)

    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaKey}&response=${token}`;

    fetch(url, {
        method: 'post'
    })
        .then(response => response.json())
        .then(google_response => {
     
            if(google_response.success){
                next()
            }
        })
        .catch(error => res.json({ error }));
    
}


// async function createAssessment(
    
//     projectID,
//     recaptchaSiteKey,
//     token,
//     recaptchaAction
//   ) {
//     // try {
        
//     //     const client = new RecaptchaEnterpriseServiceClient();
//     //     const projectPath = client.projectPath(projectID);
//     //     const request = {
//     //       assessment: {
//     //         event: {
//     //           token: token,
//     //           siteKey: recaptchaSiteKey,
//     //         },
//     //       },
//     //       parent: projectPath,
//     //     };
//     //     const [response] = await client.createAssessment(request);
//     //     console.log(response);
//     //     if (!response.tokenProperties.valid) {
//     //       console.log(
//     //         "The CreateAssessment call failed because the token was: " +
//     //           response.tokenProperties.invalidReason
//     //       );
      
//     //       return null;
//     //     }
//     //     if (response.tokenProperties.action === recaptchaAction) {
//     //       return response.riskAnalysis.score;
//     //     } else {
//     //       console.log(
//     //         "The action attribute in your reCAPTCHA tag " +
//     //           "does not match the action you are expecting to score"
//     //       );
//     //       return null;
//     //     }
//     // } catch (error) {
//     //     console.log(error);

//     // }
//   }







async function ifuser(req, res, next) {
    if (req.session.user) {
        const _id = req.session.user._id
        const data = await user.findOne({ _id: new ObjectId(_id), status: true })
        console.log(data);
        // req.session.user = data
        if (data) {
            if (req.session.url) {
                const url = req.session.url
                req.session.url = null
                res.redirect(url)

            } else {
                req.session.user = data
                next()
            }
        } else {
            req.session.user = null
            res.redirect("/login")
        }
    } else {
        req.session.url = req.url
        console.log(req.url);
        res.redirect("/login")
    }
}
function nouser(req, res, next) {
    if (req.session.user) {
        res.redirect("/")
    } else {
        next()
    }
}
function ifadmin(req, res, next) {
    if (req.session.admin) {
        next()
    } else {
        req.session.adminUrl = req.url
        res.redirect("/admin/login")
    }
}
function noadmin(req, res, next) {
    if (req.session.admin) {
        res.redirect("/admin")
    } else {
        next()
    }
}
const sharp = require("sharp")
const path = require("path")
async function sharp_cat(req, res, next) {
    if (req.file) {
        const imageName = `${Date.now()}${Math.round() * 1000}${req.file.originalname}`
        req.body.image = imageName
        sharp(req.file.buffer).resize(300, 300).toFile(path.join(__dirname, "../public/image/products/", imageName), (err, info) => {
            if (err) {
                console.log(err);
                // Handle error
                return res.status(500).send('Error processing image');
            } else {
                next()
            }
        })
    } else {
        next()
    }

}

async function sharp_pro(req, res, next) {
    req.body.image = []
    req.body.status = false
    req.files.forEach(d => {
        const imageName = `${Date.now()}${Math.round() * 1000}${d.originalname}`
        req.body.image.push(imageName)
        sharp(d.buffer).resize(300, 300).toFile(path.join(__dirname, "../public/image/products/", imageName), async (err, info) => {
            if (err) {
                console.log(err);
            }
        })
    })

    next()

}
async function sharp_up(req, res, next) {
    req.body.image = {}
    req.body.status = false
    console.log(req.files);
    const files = req.files
    for (const data in files) {
        const d = files[data][0]
        console.log(d)
        console.log(data)
        const imageName = `${Date.now()}${Math.round() * 1000}${d.originalname}`
        req.body.image[`image.${data}`] = imageName;
        sharp(d.buffer).resize(300, 300).toFile(path.join(__dirname, "../public/image/products/", imageName), async (err, info) => {
            if (err) {
                console.log(err);
            }
        })
    }
    console.log(req.body.image);
    next()

}
async function sharp_not(req, res, next) {
    if (req.file) {
        const imageName = `${Date.now()}${Math.round() * 1000}${req.file.originalname}`
        req.body.image = imageName
        console.log("req.body");
        console.log(req.body);
        console.log("req.body");
        sharp(req.file.buffer).resize(192, 192).toFile(path.join(__dirname, "../public/image/notification/", imageName), (err, info) => {
            if (err) {
                console.log(err);
                // Handle error
                return res.status(500).send('Error processing image');
            } else {
                next()
            }
        })
    } else {
        next()
    }

}
async function sharp_ban(req, res, next) {
    if (req.file) {
        const imageName = `${Date.now()}${Math.round() * 1000}${req.file.originalname}`
        req.body.image = imageName
        console.log("req.body");
        console.log(req.body);
        console.log("req.body");
        sharp(req.file.buffer).resize(1024, 640).toFile(path.join(__dirname, "../public/image/notification/", imageName), (err, info) => {
            if (err) {
                console.log(err);
                // Handle error
                return res.status(500).send('Error processing image');
            } else {
                next()
            }
        })
    } else {
        next()
    }

}


module.exports = { sharp_not, nouser, ifuser, sharp_up, ifadmin, noadmin, sharp_pro, sharp_cat, sharp_ban,recaptcha }