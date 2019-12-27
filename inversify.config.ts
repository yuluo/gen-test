import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "./src/types";
import { IRandomGenerator, IUtils, IPayloadGenerator, IRequireTestGenerator, IParameterGenerator } from "./src/interfaces";
import { RandomGenerator } from "./src/libs/random-generator"
import { Utils } from "./src/libs/utils";
import { PayloadGenerator } from "./src/libs/payload-generator";
import { RequireTestGenerator } from "./src/libs/require-test-generator";
import { ParameterGenerator } from "./src/libs/parameter-generator";
 
const container = new Container({defaultScope: "Singleton"});
container.bind<IParameterGenerator>(TYPES.IParameterGenerator).to(ParameterGenerator);
container.bind<IPayloadGenerator>(TYPES.IPayloadGenerator).to(PayloadGenerator);
container.bind<IRandomGenerator>(TYPES.IRandomGenerator).to(RandomGenerator);
container.bind<IRequireTestGenerator>(TYPES.IRequireTestGenerator).to(RequireTestGenerator);
container.bind<IUtils>(TYPES.IUtils).to(Utils); 


export { container };