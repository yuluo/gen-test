import {RandomGenerator} from "./random-generator";
import { IRandomGenerator } from "../interfaces";

describe("RandomGenerator", () => {
    let randomGenerator: IRandomGenerator;

    beforeEach(() => {
        randomGenerator = new RandomGenerator();
    });

    test("should return a boolean value", () => {
        expect(typeof randomGenerator.randomBoolean()).toEqual("boolean");
    })
});