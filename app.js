const express = require('express');
const bodyParser = require('body-parser');
const mongooose = require('mongoose');
const _ = require("lodash");
const https = require('https');
const { ListCollectionsCursor } = require('mongodb');
const date = require(__dirname +"/date.js");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');
mongooose.connect("mongodb+srv://admin-shakil:test123@cluster0.gfhbm.mongodb.net/todolistDB",()=>{
    // console.log("Connected to todolistDB");
});
const itemSchema=new mongooose.Schema({
    name:String,
});
const Item = mongooose.model("item",itemSchema);

const item1 = new Item({
    name:"Welcome to your todoList!"
});
const item2 = new Item({
    name:"Hit the  + button to add a new item."
});
const item3 = new Item({
    name:"<-- Hit this to delete an item.>"
});
const defaultItems = [item1,item2,item3];
const listSchema = {
    name :String,
    items:[itemSchema]
};
const List = mongooose.model("List",listSchema);

app.get('/', function (req, res){
    let day=date.getDay();
    Item.find({},function(err,foundItems){
        if (foundItems.length===0) {
            Item.insertMany(defaultItems,function(err){
    if (err)
         console.log(err);
        else
        res.redirect("/");
    });
         
            }
            res.render('list', {listTitle:"Today",itemList:foundItems});
    });
 
    
})
app.get('/:customListName', (req, res) => {
    const customListName = _.capitalize(req.params.customListName) ;
    List.findOne({name:customListName},function(err,foundList){
      if (!err) {
          if (!foundList) {
            //    create a new list
            const list = new List ({
                name:customListName,
                items:defaultItems,
            });
            list.save();
            res.redirect("/"+customListName);
             
          } else {
            //    show existing list
              res.render("list",{listTitle:foundList.name,
                itemList:foundList.items,
            })
          }        
      }
    });
   
})

// Post routes 
app.post('/', function (req, res){
    const itemName = req.body.newItem; 
    const listName = req.body.list;
    // if (itemName !== ""){
        const item = new Item({
            name:itemName,
        });
    // }
        if(listName === "Today" || listName === "today"){

            item.save();
            res.redirect("/");
        } else{   
            List.findOne({name:listName},function(err,foundList){
                // console.log(foundList);
                foundList.items.push(item);
                foundList.save();
                res.redirect("/" + listName);
            })
            };
    }
  )

  app.post('/delete',function(req,res){
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;
    if (listName === "Today" || listName === "today"){
        Item.findByIdAndRemove(checkedItemId,function(err){
            if (!err) {
                console.log("Deleted item");
                res.redirect("/");
            }
        })
    } else {
        List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}},function(err,foundList){
            if(!err){
                // console.log(listName);
                res.redirect("/"+listName);
            }
        })
        
    }
  });
// SERVER 
app.listen(3000,function(req,res){
    console.log("server working on port 3000");
}) 

