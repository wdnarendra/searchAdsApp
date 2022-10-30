const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://hicircleconnect:MoGQb4T528xZo6RA@circlemongodbcluster.y38k0px.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
let express = require('express')
let app = express()
let body = require('body-parser')
let cors = require('cors')
class databaseClass {
    constructor() {
    }
    findCollection(table) {
        return this.database.collection(table);
    }
    async connectToDb() {
        try {
            await client.connect();
            this.database = await client.db("searchApp")
        } catch (error) {
            console.log(error);
        }
    }
    connect(table) {
        return this.findCollection(table)
    }
}

let database = new databaseClass()
database.connectToDb()
async function getads(text) {
    let response=[]
    await database.connect('Ads').aggregate([
        {   
            $lookup: {
                from: "Companies",
                localField: "companyId",
                foreignField: "_id",
                as: "company"
            }
        },
        {
            $unwind:{path:"$company"}
        },
        {
            $replaceRoot: { newRoot: { $mergeObjects: ["$company", "$$ROOT" ] } }
         },
         { $project: { company: 0 } },
         {
            $match:{
                $or:[{name:{$in:[...text]}},{primaryText:{$in:[...text]}},{headline:{$in:[...text]}},{description:{$in:[...text]}}]
            }
       }
    ]).forEach(value => {
        response.push(value)
    })
    return response
    // we can also use the $text with $search using text indexes but $match with $text only support the first stage 
    // database.connect('Ads').aggregate([
    //     {$match:{$text:{$search:text}}},
    //     {$lookup:{
    //             from: "Companies",
    //             localField: "companyId",
    //             foreignField: "_id",
    //             as: "company"
    //     }},
    //     {
    //         $unwind:{path:"$company"}
    //     },
    //     {
    //         $replaceRoot: { newRoot: { $mergeObjects: ["$company", "$$ROOT" ] } }
    //      },
    //      { $project: { company: 0 } },
    // ])
}
app.use(body.json(),cors())
app.post('/api',async(req,res)=>{
    let payload = req.body.text.split(' ').filter(e =>  e)
    let regexpayload =[]
    for(let i = 0;i<payload.length;i++){
        regexpayload.push(new RegExp(`\\b(${payload[i]})\\b`,'i'))
    }
    let response=await getads(regexpayload)
    res.send(JSON.stringify({ads:response}))
})
app.listen(80)