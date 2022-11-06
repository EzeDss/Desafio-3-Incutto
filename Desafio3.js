const express =require('express')
const fs = require('fs');

const app = express()

app.get('/', (req, res)=>{
    res.send('Usar Ruta "/productos" para ver los productos disponibles. Usar Ruta "/productorandom" para ver un prducto random')
})

const server = app.listen(8080, () =>{
    console.log("Servidor escuchando en el 8080")
})

class Contenedor {

    LaId;
    listaOBJ = new Array();

    constructor(nombre){
        this.nombre = nombre;
        if(fs.existsSync(nombre)){
            this.listaOBJ = JSON.parse(fs.readFileSync(this.nombre, 'utf-8'));
            this.LaId = this.getId();
        }
        else {
            this.LaId = 1
            fs.writeFileSync(this.nombre, JSON.stringify([]));
        }

    }

    async getById(id) {
        let obj = null;
        this.listaOBJ.map((elemento) => {
            if (elemento.id == id)
            {
                obj = elemento;
            }
        })
        return obj
    }

    getId () {
        if (this.listaOBJ.length > 0) {
            let maxId = this.listaOBJ.reduce((acc,current) => {
                return Math.max(acc, current.id)
            }, 0)
            return maxId + 1;
        } else {
            return 1;
        }
    }

    async getAll(){
        try{
            const contenido = await fs.promises.readFile(`./${this.nombre}`, 'utf-8')
            this.contenidoOBJ = JSON.parse (contenido)
            return this.contenidoOBJ;
            }
        catch (err) {
            console.log("error")
            }
    }

    async save(object) {
        try{
            object['id'] = this.LaId;
            this.LaId++;
            this.listaOBJ.push(object);
            await fs.promises.writeFile(this.nombre, JSON.stringify(this.listaOBJ, null, 2))
            console.log("El producto se guardo con la id: " + object.id)
            return Promise.resolve(object.id);
        }
        catch(error) {
            console.log(error)
        }
    }
}

app.get('/productos', async (req, res)=>{
    const losProductos = await Usuario1.getAll ()
    res.send(losProductos)
})

app.get('/productorandom', async (req, res) => {
    const num = Math.ceil(Math.random() * (Usuario1.listaOBJ.length))
    const proran = await Usuario1.getById(num)
    res.send(proran)
})

let Usuario1 = new Contenedor("productos.txt")
//let producto1 = {title: "Cartuchera", price: 123, thumbnail: "http://www.google.com.ar"};
//let producto2 = {title: "Goma", price: 123, thumbnail: "http://www.google.com.ar"};
//let producto3 = {title: "Lapiz", price: 123, thumbnail: "http://www.google.com.ar"};

//Usuario1.save(producto1)
//Usuario1.save(producto2)
//Usuario1.save(producto3)