import { faker } from '@faker-js/faker/locale/es';

export const generateProducts = ()=>
{
    const categories = ["Malbec", "Carmenere", "Tannat", "Merlot", "Cabernet Sauvignon"];
    const status = [true,false];
    
    return {
        _id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        category: faker.helpers.arrayElement(categories),
        code: faker.number.int(),
        status: faker.helpers.arrayElement(status),
        stock: faker.number.int(),
        price: faker.commerce.price(),
        thumbnail: "https://t4.ftcdn.net/jpg/04/06/75/09/360_F_406750970_7CqfQUy0FRjd0zYrdiSjNWIbXXjXorZl.jpg",
        createdAt: faker.date.anytime(),
        updatedAt: faker.date.anytime()
    }
}