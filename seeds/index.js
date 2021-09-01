const mongoose = require('mongoose')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')
const Campground = require('../models/campground')

mongoose.connect('mongodb://localhost:27017/yelpCamp', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch((err) => {
        console.log('ERROR!!!')
    })

const randArrElement = (array) => {
    return array[Math.floor(Math.random() * array.length)]
}

const seedDB = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 200; i++) {
        let rand1000 = Math.floor(Math.random() * 1000)
        let price = Math.floor(Math.random() * 20) + 10
        const randCamp = new Campground({
            author: '61260b1657d71f1d90f35d44',
            location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
            title: `${randArrElement(descriptors)}  ${randArrElement(places)}`,
            price: price,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem assumenda sit, laudantium accusamus omnis illo quas quis quos. Eum nihil ratione quia perspiciatis alias iusto aliquid impedit maiores, velit odio?',
            images: [
                {
                    url:
                        'https://res.cloudinary.com/dhovhpaur/image/upload/v1630078789/YelpCamp/tddwey8o6tjeposselc9.jpg',
                    filename: 'YelpCamp/tddwey8o6tjeposselc9'
                },
                {
                    url:
                        'https://res.cloudinary.com/dhovhpaur/image/upload/v1630078810/YelpCamp/r1idgxchuufr5oczwkv3.jpg',
                    filename: 'YelpCamp/r1idgxchuufr5oczwkv3'
                }],
            geometry:
            {
                type: 'Point',
                coordinates: [
                    cities[rand1000].longitude,
                    cities[rand1000].latitude
                ]
            }
        })
        await randCamp.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})