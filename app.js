require("dotenv").config()
const fs=require("fs").promises
const express=require("express")

const Io =require("./Io")
const Baza = new Io("./baza.json")

const app=express()

app.use(express.json())

//--Get baza.json fayildagi malumotlarni oqish va yuboriladi
app.get("/", async (req, res)=>
{
    const baza=await Baza.read()
    res.json(baza)

});

//---POST yangi mahsulot nomi boyicha tekshiradi baza.json fayilda bolsa qiymat qoshadi aks holda yangi mahsulot qoshadi
app.post("/", async (req, res)=>
{

    let baza=await Baza.read()
    const newData=req.body
    let n=true
      
      for(let i=0; i<baza.length; i++)
      {
        if(baza[i].name===newData.name)
        {
          
          baza[i].value +=newData.value
          await Baza.write(baza) 
          res.json("Bu mahsulot mavjud")
          n=false
        }
      }
      if(n)
      {
        newData.id=(baza[baza.length-1]?.id || 0) +1
        baza.push(newData)
        await Baza.write(baza)
        res.send("Yangi mahsulot qoshildi")

      }
});


//---PUT id boyicha name yoki value qiymat qay biri kelsa shuni o'zgartadi
app.put("/", async (req, res)=>
{
    let baza=await Baza.read()
    const newData=req.body
    for(let i=0; i<baza.length; i++)
      {
        if(baza[i].id===newData.id)
        {
          
          baza[i].value =newData.value ? newData.value : baza[i].value
          baza[i].name =newData?.name ? newData.name : baza[i].name
          await Baza.write(baza) 
          res.json("Successful")
        }
      }
    res.send()

});

//---DELET id boyicha o'chiradi
app.delete("/", async (req, res)=>
{
    let baza=await Baza.read()
    const newData=req.body
    for(let i=0; i<baza.length; i++)
      {
        if(baza[i].id===newData.id)
        {
          baza.splice(i, 1)
        }
      }
      await Baza.write(baza) 
    res.send("Deleted successfully")

});

const PORT=process.env.PORT;

app.listen(PORT, ()=>{
    console.log(PORT);
})