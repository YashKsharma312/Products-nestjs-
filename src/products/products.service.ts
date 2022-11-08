import { Injectable,NotFoundException } from "@nestjs/common";
import { NotAcceptableException } from "@nestjs/common/exceptions";
import { title } from "process";
import { Product } from "./product.model";
import { InjectModel } from "@nestjs/mongoose/dist";
import { Model } from "mongoose";


@Injectable()
export class ProductService{
    

    constructor(@InjectModel('Product')private readonly productModel:Model<Product>){}

    async insertProduct(title:string,description:string,price:number){
        const prodId=Math.random().toString();
       const newProduct=new this.productModel({title,
        description,
        price})
      const result=await newProduct.save();
      console.log(result)
       return result.id as string;
}

async getProducts(){
    const products=await this.productModel.find().exec();
    return products.map((prod)=>({id:prod.id,
        title:prod.title,
        description:prod.description,
        price:prod.price}));
}

async getSingleProduct(productId:string){
    const product=await this.findProduct(productId);
    return {id:product.id,
        title:product.title,
        description:product.description,
        price:product.price}
}

async updateProduct(productId: string,
    title: string,
    desc:string,
    price:number
    ){
    const updatedProduct =await this.findProduct(productId);
    
    if(title){
       updatedProduct.title=title;
    }
    if(desc){
       updatedProduct.description=desc;
    }
    if(title){
       updatedProduct.price=price;
    }
    updatedProduct.save();

}

private async findProduct(id:string):Promise<Product>{
    let product;
    try{
     product=await this.productModel.findById(id).exec();
    }catch(error){
        throw new NotFoundException('Could not find product.')
    }
    if(!product){
        throw new NotAcceptableException('could not find product');
    }
    return product;
}

async deleteProduct(prodId:string){
    const result=await this.productModel.deleteOne({_id:prodId}).exec();
    console.log(result);
}}