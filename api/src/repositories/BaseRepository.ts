import { Model,Document } from "mongoose";

export interface IBaseRepository<T extends Document>{
    create(item:Partial<T>):Promise<T>;
    findById(id: string): Promise<T | null>;
    findAll(): Promise<T[]>;
    update(id: string, item: Partial<T>): Promise<T | null>;
    delete(id: string): Promise<T | null>;
}


export class BaseRepository<T extends Document> implements IBaseRepository<T>{
    protected model: Model<T>;

    constructor(model:Model<T>){
        this.model = model
    }

    async create(item: Partial<T>): Promise<T> {
        return this.model.create(item)
    }

     async findById(id: string): Promise<T | null> {
        return this.model.findById(id);
    }

    async findAll(): Promise<T[]> {
        return this.model.find();
    }

    async update(id: string, item: Partial<T>): Promise<T | null> {
        return this.model.findByIdAndUpdate(id, item, { new: true });
    }

    async delete(id: string): Promise<T | null> {
        return this.model.findByIdAndDelete(id);
    }
}