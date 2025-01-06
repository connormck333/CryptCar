async function getRentalCars(carContract) {
    const response = await carContract.getRentalCars();
    const cars = [];
    for (let car of response) {
        cars.push({
            brand: car[0],
            model: car[1],
            imageURL: car[2],
            description: car[3],
            pricePerDay: parseInt(car[4]),
            depositAmount: parseInt(car[5]),
            termsAndConditions: car[6],
            location: car[7],
            owner: car[8],
            id: car[9]
        });
    }

    return cars;
}

async function getRentalCarsByOwnerId(carContract, ownerId) {
    const cars = await getRentalCars(carContract);
    const ownerCars = cars.filter(car => car.owner.toLowerCase() == ownerId.toLowerCase());

    return ownerCars;
}

function returnDeposit(carContract, carId, callbackOnSuccess) {
    carContract.returnDeposit(carId)
        .then(callbackOnSuccess)
        .catch(() => alert("Error, could not return deposit."));
}

export {
    getRentalCars,
    getRentalCarsByOwnerId,
    returnDeposit
}