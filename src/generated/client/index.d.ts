
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Event
 * 
 */
export type Event = $Result.DefaultSelection<Prisma.$EventPayload>
/**
 * Model EventBenefit
 * 
 */
export type EventBenefit = $Result.DefaultSelection<Prisma.$EventBenefitPayload>
/**
 * Model Jersey
 * 
 */
export type Jersey = $Result.DefaultSelection<Prisma.$JerseyPayload>
/**
 * Model Order
 * 
 */
export type Order = $Result.DefaultSelection<Prisma.$OrderPayload>
/**
 * Model Participant
 * 
 */
export type Participant = $Result.DefaultSelection<Prisma.$ParticipantPayload>
/**
 * Model QrToken
 * 
 */
export type QrToken = $Result.DefaultSelection<Prisma.$QrTokenPayload>
/**
 * Model Log
 * 
 */
export type Log = $Result.DefaultSelection<Prisma.$LogPayload>
/**
 * Model BibConfiguration
 * 
 */
export type BibConfiguration = $Result.DefaultSelection<Prisma.$BibConfigurationPayload>
/**
 * Model Role
 * 
 */
export type Role = $Result.DefaultSelection<Prisma.$RolePayload>
/**
 * Model Admin
 * 
 */
export type Admin = $Result.DefaultSelection<Prisma.$AdminPayload>
/**
 * Model AppSetting
 * 
 */
export type AppSetting = $Result.DefaultSelection<Prisma.$AppSettingPayload>
/**
 * Model RoutePoint
 * 
 */
export type RoutePoint = $Result.DefaultSelection<Prisma.$RoutePointPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const OrderStatus: {
  PENDING: 'PENDING',
  SETTLEMENT: 'SETTLEMENT',
  CAPTURE: 'CAPTURE',
  CANCEL: 'CANCEL',
  EXPIRE: 'EXPIRE',
  DENY: 'DENY',
  REFUND: 'REFUND'
};

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus]


export const Gender: {
  MALE: 'MALE',
  FEMALE: 'FEMALE'
};

export type Gender = (typeof Gender)[keyof typeof Gender]


export const BloodType: {
  A: 'A',
  B: 'B',
  AB: 'AB',
  O: 'O'
};

export type BloodType = (typeof BloodType)[keyof typeof BloodType]

}

export type OrderStatus = $Enums.OrderStatus

export const OrderStatus: typeof $Enums.OrderStatus

export type Gender = $Enums.Gender

export const Gender: typeof $Enums.Gender

export type BloodType = $Enums.BloodType

export const BloodType: typeof $Enums.BloodType

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.event`: Exposes CRUD operations for the **Event** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Events
    * const events = await prisma.event.findMany()
    * ```
    */
  get event(): Prisma.EventDelegate<ExtArgs>;

  /**
   * `prisma.eventBenefit`: Exposes CRUD operations for the **EventBenefit** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EventBenefits
    * const eventBenefits = await prisma.eventBenefit.findMany()
    * ```
    */
  get eventBenefit(): Prisma.EventBenefitDelegate<ExtArgs>;

  /**
   * `prisma.jersey`: Exposes CRUD operations for the **Jersey** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Jerseys
    * const jerseys = await prisma.jersey.findMany()
    * ```
    */
  get jersey(): Prisma.JerseyDelegate<ExtArgs>;

  /**
   * `prisma.order`: Exposes CRUD operations for the **Order** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Orders
    * const orders = await prisma.order.findMany()
    * ```
    */
  get order(): Prisma.OrderDelegate<ExtArgs>;

  /**
   * `prisma.participant`: Exposes CRUD operations for the **Participant** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Participants
    * const participants = await prisma.participant.findMany()
    * ```
    */
  get participant(): Prisma.ParticipantDelegate<ExtArgs>;

  /**
   * `prisma.qrToken`: Exposes CRUD operations for the **QrToken** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more QrTokens
    * const qrTokens = await prisma.qrToken.findMany()
    * ```
    */
  get qrToken(): Prisma.QrTokenDelegate<ExtArgs>;

  /**
   * `prisma.log`: Exposes CRUD operations for the **Log** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Logs
    * const logs = await prisma.log.findMany()
    * ```
    */
  get log(): Prisma.LogDelegate<ExtArgs>;

  /**
   * `prisma.bibConfiguration`: Exposes CRUD operations for the **BibConfiguration** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BibConfigurations
    * const bibConfigurations = await prisma.bibConfiguration.findMany()
    * ```
    */
  get bibConfiguration(): Prisma.BibConfigurationDelegate<ExtArgs>;

  /**
   * `prisma.role`: Exposes CRUD operations for the **Role** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Roles
    * const roles = await prisma.role.findMany()
    * ```
    */
  get role(): Prisma.RoleDelegate<ExtArgs>;

  /**
   * `prisma.admin`: Exposes CRUD operations for the **Admin** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Admins
    * const admins = await prisma.admin.findMany()
    * ```
    */
  get admin(): Prisma.AdminDelegate<ExtArgs>;

  /**
   * `prisma.appSetting`: Exposes CRUD operations for the **AppSetting** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AppSettings
    * const appSettings = await prisma.appSetting.findMany()
    * ```
    */
  get appSetting(): Prisma.AppSettingDelegate<ExtArgs>;

  /**
   * `prisma.routePoint`: Exposes CRUD operations for the **RoutePoint** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RoutePoints
    * const routePoints = await prisma.routePoint.findMany()
    * ```
    */
  get routePoint(): Prisma.RoutePointDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Event: 'Event',
    EventBenefit: 'EventBenefit',
    Jersey: 'Jersey',
    Order: 'Order',
    Participant: 'Participant',
    QrToken: 'QrToken',
    Log: 'Log',
    BibConfiguration: 'BibConfiguration',
    Role: 'Role',
    Admin: 'Admin',
    AppSetting: 'AppSetting',
    RoutePoint: 'RoutePoint'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "user" | "event" | "eventBenefit" | "jersey" | "order" | "participant" | "qrToken" | "log" | "bibConfiguration" | "role" | "admin" | "appSetting" | "routePoint"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Event: {
        payload: Prisma.$EventPayload<ExtArgs>
        fields: Prisma.EventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          findFirst: {
            args: Prisma.EventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          findMany: {
            args: Prisma.EventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>[]
          }
          create: {
            args: Prisma.EventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          createMany: {
            args: Prisma.EventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>[]
          }
          delete: {
            args: Prisma.EventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          update: {
            args: Prisma.EventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          deleteMany: {
            args: Prisma.EventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.EventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          aggregate: {
            args: Prisma.EventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEvent>
          }
          groupBy: {
            args: Prisma.EventGroupByArgs<ExtArgs>
            result: $Utils.Optional<EventGroupByOutputType>[]
          }
          count: {
            args: Prisma.EventCountArgs<ExtArgs>
            result: $Utils.Optional<EventCountAggregateOutputType> | number
          }
        }
      }
      EventBenefit: {
        payload: Prisma.$EventBenefitPayload<ExtArgs>
        fields: Prisma.EventBenefitFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EventBenefitFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventBenefitPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EventBenefitFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventBenefitPayload>
          }
          findFirst: {
            args: Prisma.EventBenefitFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventBenefitPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EventBenefitFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventBenefitPayload>
          }
          findMany: {
            args: Prisma.EventBenefitFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventBenefitPayload>[]
          }
          create: {
            args: Prisma.EventBenefitCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventBenefitPayload>
          }
          createMany: {
            args: Prisma.EventBenefitCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EventBenefitCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventBenefitPayload>[]
          }
          delete: {
            args: Prisma.EventBenefitDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventBenefitPayload>
          }
          update: {
            args: Prisma.EventBenefitUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventBenefitPayload>
          }
          deleteMany: {
            args: Prisma.EventBenefitDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EventBenefitUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.EventBenefitUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventBenefitPayload>
          }
          aggregate: {
            args: Prisma.EventBenefitAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEventBenefit>
          }
          groupBy: {
            args: Prisma.EventBenefitGroupByArgs<ExtArgs>
            result: $Utils.Optional<EventBenefitGroupByOutputType>[]
          }
          count: {
            args: Prisma.EventBenefitCountArgs<ExtArgs>
            result: $Utils.Optional<EventBenefitCountAggregateOutputType> | number
          }
        }
      }
      Jersey: {
        payload: Prisma.$JerseyPayload<ExtArgs>
        fields: Prisma.JerseyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.JerseyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JerseyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.JerseyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JerseyPayload>
          }
          findFirst: {
            args: Prisma.JerseyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JerseyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.JerseyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JerseyPayload>
          }
          findMany: {
            args: Prisma.JerseyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JerseyPayload>[]
          }
          create: {
            args: Prisma.JerseyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JerseyPayload>
          }
          createMany: {
            args: Prisma.JerseyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.JerseyCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JerseyPayload>[]
          }
          delete: {
            args: Prisma.JerseyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JerseyPayload>
          }
          update: {
            args: Prisma.JerseyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JerseyPayload>
          }
          deleteMany: {
            args: Prisma.JerseyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.JerseyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.JerseyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JerseyPayload>
          }
          aggregate: {
            args: Prisma.JerseyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateJersey>
          }
          groupBy: {
            args: Prisma.JerseyGroupByArgs<ExtArgs>
            result: $Utils.Optional<JerseyGroupByOutputType>[]
          }
          count: {
            args: Prisma.JerseyCountArgs<ExtArgs>
            result: $Utils.Optional<JerseyCountAggregateOutputType> | number
          }
        }
      }
      Order: {
        payload: Prisma.$OrderPayload<ExtArgs>
        fields: Prisma.OrderFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OrderFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OrderFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          findFirst: {
            args: Prisma.OrderFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OrderFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          findMany: {
            args: Prisma.OrderFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>[]
          }
          create: {
            args: Prisma.OrderCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          createMany: {
            args: Prisma.OrderCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OrderCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>[]
          }
          delete: {
            args: Prisma.OrderDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          update: {
            args: Prisma.OrderUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          deleteMany: {
            args: Prisma.OrderDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OrderUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.OrderUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          aggregate: {
            args: Prisma.OrderAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOrder>
          }
          groupBy: {
            args: Prisma.OrderGroupByArgs<ExtArgs>
            result: $Utils.Optional<OrderGroupByOutputType>[]
          }
          count: {
            args: Prisma.OrderCountArgs<ExtArgs>
            result: $Utils.Optional<OrderCountAggregateOutputType> | number
          }
        }
      }
      Participant: {
        payload: Prisma.$ParticipantPayload<ExtArgs>
        fields: Prisma.ParticipantFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ParticipantFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ParticipantFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantPayload>
          }
          findFirst: {
            args: Prisma.ParticipantFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ParticipantFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantPayload>
          }
          findMany: {
            args: Prisma.ParticipantFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantPayload>[]
          }
          create: {
            args: Prisma.ParticipantCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantPayload>
          }
          createMany: {
            args: Prisma.ParticipantCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ParticipantCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantPayload>[]
          }
          delete: {
            args: Prisma.ParticipantDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantPayload>
          }
          update: {
            args: Prisma.ParticipantUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantPayload>
          }
          deleteMany: {
            args: Prisma.ParticipantDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ParticipantUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ParticipantUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantPayload>
          }
          aggregate: {
            args: Prisma.ParticipantAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateParticipant>
          }
          groupBy: {
            args: Prisma.ParticipantGroupByArgs<ExtArgs>
            result: $Utils.Optional<ParticipantGroupByOutputType>[]
          }
          count: {
            args: Prisma.ParticipantCountArgs<ExtArgs>
            result: $Utils.Optional<ParticipantCountAggregateOutputType> | number
          }
        }
      }
      QrToken: {
        payload: Prisma.$QrTokenPayload<ExtArgs>
        fields: Prisma.QrTokenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.QrTokenFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QrTokenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.QrTokenFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QrTokenPayload>
          }
          findFirst: {
            args: Prisma.QrTokenFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QrTokenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.QrTokenFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QrTokenPayload>
          }
          findMany: {
            args: Prisma.QrTokenFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QrTokenPayload>[]
          }
          create: {
            args: Prisma.QrTokenCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QrTokenPayload>
          }
          createMany: {
            args: Prisma.QrTokenCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.QrTokenCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QrTokenPayload>[]
          }
          delete: {
            args: Prisma.QrTokenDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QrTokenPayload>
          }
          update: {
            args: Prisma.QrTokenUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QrTokenPayload>
          }
          deleteMany: {
            args: Prisma.QrTokenDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.QrTokenUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.QrTokenUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QrTokenPayload>
          }
          aggregate: {
            args: Prisma.QrTokenAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateQrToken>
          }
          groupBy: {
            args: Prisma.QrTokenGroupByArgs<ExtArgs>
            result: $Utils.Optional<QrTokenGroupByOutputType>[]
          }
          count: {
            args: Prisma.QrTokenCountArgs<ExtArgs>
            result: $Utils.Optional<QrTokenCountAggregateOutputType> | number
          }
        }
      }
      Log: {
        payload: Prisma.$LogPayload<ExtArgs>
        fields: Prisma.LogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LogPayload>
          }
          findFirst: {
            args: Prisma.LogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LogPayload>
          }
          findMany: {
            args: Prisma.LogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LogPayload>[]
          }
          create: {
            args: Prisma.LogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LogPayload>
          }
          createMany: {
            args: Prisma.LogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LogPayload>[]
          }
          delete: {
            args: Prisma.LogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LogPayload>
          }
          update: {
            args: Prisma.LogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LogPayload>
          }
          deleteMany: {
            args: Prisma.LogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.LogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LogPayload>
          }
          aggregate: {
            args: Prisma.LogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLog>
          }
          groupBy: {
            args: Prisma.LogGroupByArgs<ExtArgs>
            result: $Utils.Optional<LogGroupByOutputType>[]
          }
          count: {
            args: Prisma.LogCountArgs<ExtArgs>
            result: $Utils.Optional<LogCountAggregateOutputType> | number
          }
        }
      }
      BibConfiguration: {
        payload: Prisma.$BibConfigurationPayload<ExtArgs>
        fields: Prisma.BibConfigurationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BibConfigurationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BibConfigurationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BibConfigurationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BibConfigurationPayload>
          }
          findFirst: {
            args: Prisma.BibConfigurationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BibConfigurationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BibConfigurationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BibConfigurationPayload>
          }
          findMany: {
            args: Prisma.BibConfigurationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BibConfigurationPayload>[]
          }
          create: {
            args: Prisma.BibConfigurationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BibConfigurationPayload>
          }
          createMany: {
            args: Prisma.BibConfigurationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BibConfigurationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BibConfigurationPayload>[]
          }
          delete: {
            args: Prisma.BibConfigurationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BibConfigurationPayload>
          }
          update: {
            args: Prisma.BibConfigurationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BibConfigurationPayload>
          }
          deleteMany: {
            args: Prisma.BibConfigurationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BibConfigurationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.BibConfigurationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BibConfigurationPayload>
          }
          aggregate: {
            args: Prisma.BibConfigurationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBibConfiguration>
          }
          groupBy: {
            args: Prisma.BibConfigurationGroupByArgs<ExtArgs>
            result: $Utils.Optional<BibConfigurationGroupByOutputType>[]
          }
          count: {
            args: Prisma.BibConfigurationCountArgs<ExtArgs>
            result: $Utils.Optional<BibConfigurationCountAggregateOutputType> | number
          }
        }
      }
      Role: {
        payload: Prisma.$RolePayload<ExtArgs>
        fields: Prisma.RoleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RoleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RoleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          findFirst: {
            args: Prisma.RoleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RoleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          findMany: {
            args: Prisma.RoleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>[]
          }
          create: {
            args: Prisma.RoleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          createMany: {
            args: Prisma.RoleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RoleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>[]
          }
          delete: {
            args: Prisma.RoleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          update: {
            args: Prisma.RoleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          deleteMany: {
            args: Prisma.RoleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RoleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.RoleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          aggregate: {
            args: Prisma.RoleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRole>
          }
          groupBy: {
            args: Prisma.RoleGroupByArgs<ExtArgs>
            result: $Utils.Optional<RoleGroupByOutputType>[]
          }
          count: {
            args: Prisma.RoleCountArgs<ExtArgs>
            result: $Utils.Optional<RoleCountAggregateOutputType> | number
          }
        }
      }
      Admin: {
        payload: Prisma.$AdminPayload<ExtArgs>
        fields: Prisma.AdminFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AdminFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AdminFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          findFirst: {
            args: Prisma.AdminFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AdminFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          findMany: {
            args: Prisma.AdminFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>[]
          }
          create: {
            args: Prisma.AdminCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          createMany: {
            args: Prisma.AdminCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AdminCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>[]
          }
          delete: {
            args: Prisma.AdminDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          update: {
            args: Prisma.AdminUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          deleteMany: {
            args: Prisma.AdminDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AdminUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AdminUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          aggregate: {
            args: Prisma.AdminAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAdmin>
          }
          groupBy: {
            args: Prisma.AdminGroupByArgs<ExtArgs>
            result: $Utils.Optional<AdminGroupByOutputType>[]
          }
          count: {
            args: Prisma.AdminCountArgs<ExtArgs>
            result: $Utils.Optional<AdminCountAggregateOutputType> | number
          }
        }
      }
      AppSetting: {
        payload: Prisma.$AppSettingPayload<ExtArgs>
        fields: Prisma.AppSettingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AppSettingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppSettingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AppSettingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppSettingPayload>
          }
          findFirst: {
            args: Prisma.AppSettingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppSettingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AppSettingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppSettingPayload>
          }
          findMany: {
            args: Prisma.AppSettingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppSettingPayload>[]
          }
          create: {
            args: Prisma.AppSettingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppSettingPayload>
          }
          createMany: {
            args: Prisma.AppSettingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AppSettingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppSettingPayload>[]
          }
          delete: {
            args: Prisma.AppSettingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppSettingPayload>
          }
          update: {
            args: Prisma.AppSettingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppSettingPayload>
          }
          deleteMany: {
            args: Prisma.AppSettingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AppSettingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AppSettingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppSettingPayload>
          }
          aggregate: {
            args: Prisma.AppSettingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAppSetting>
          }
          groupBy: {
            args: Prisma.AppSettingGroupByArgs<ExtArgs>
            result: $Utils.Optional<AppSettingGroupByOutputType>[]
          }
          count: {
            args: Prisma.AppSettingCountArgs<ExtArgs>
            result: $Utils.Optional<AppSettingCountAggregateOutputType> | number
          }
        }
      }
      RoutePoint: {
        payload: Prisma.$RoutePointPayload<ExtArgs>
        fields: Prisma.RoutePointFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RoutePointFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoutePointPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RoutePointFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoutePointPayload>
          }
          findFirst: {
            args: Prisma.RoutePointFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoutePointPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RoutePointFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoutePointPayload>
          }
          findMany: {
            args: Prisma.RoutePointFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoutePointPayload>[]
          }
          create: {
            args: Prisma.RoutePointCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoutePointPayload>
          }
          createMany: {
            args: Prisma.RoutePointCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RoutePointCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoutePointPayload>[]
          }
          delete: {
            args: Prisma.RoutePointDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoutePointPayload>
          }
          update: {
            args: Prisma.RoutePointUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoutePointPayload>
          }
          deleteMany: {
            args: Prisma.RoutePointDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RoutePointUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.RoutePointUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoutePointPayload>
          }
          aggregate: {
            args: Prisma.RoutePointAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRoutePoint>
          }
          groupBy: {
            args: Prisma.RoutePointGroupByArgs<ExtArgs>
            result: $Utils.Optional<RoutePointGroupByOutputType>[]
          }
          count: {
            args: Prisma.RoutePointCountArgs<ExtArgs>
            result: $Utils.Optional<RoutePointCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    orders: number
    logs: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    orders?: boolean | UserCountOutputTypeCountOrdersArgs
    logs?: boolean | UserCountOutputTypeCountLogsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountOrdersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrderWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LogWhereInput
  }


  /**
   * Count Type EventCountOutputType
   */

  export type EventCountOutputType = {
    participants: number
    benefits: number
    jerseys: number
  }

  export type EventCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    participants?: boolean | EventCountOutputTypeCountParticipantsArgs
    benefits?: boolean | EventCountOutputTypeCountBenefitsArgs
    jerseys?: boolean | EventCountOutputTypeCountJerseysArgs
  }

  // Custom InputTypes
  /**
   * EventCountOutputType without action
   */
  export type EventCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventCountOutputType
     */
    select?: EventCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * EventCountOutputType without action
   */
  export type EventCountOutputTypeCountParticipantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ParticipantWhereInput
  }

  /**
   * EventCountOutputType without action
   */
  export type EventCountOutputTypeCountBenefitsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EventBenefitWhereInput
  }

  /**
   * EventCountOutputType without action
   */
  export type EventCountOutputTypeCountJerseysArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JerseyWhereInput
  }


  /**
   * Count Type JerseyCountOutputType
   */

  export type JerseyCountOutputType = {
    participants: number
  }

  export type JerseyCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    participants?: boolean | JerseyCountOutputTypeCountParticipantsArgs
  }

  // Custom InputTypes
  /**
   * JerseyCountOutputType without action
   */
  export type JerseyCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JerseyCountOutputType
     */
    select?: JerseyCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * JerseyCountOutputType without action
   */
  export type JerseyCountOutputTypeCountParticipantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ParticipantWhereInput
  }


  /**
   * Count Type OrderCountOutputType
   */

  export type OrderCountOutputType = {
    participants: number
  }

  export type OrderCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    participants?: boolean | OrderCountOutputTypeCountParticipantsArgs
  }

  // Custom InputTypes
  /**
   * OrderCountOutputType without action
   */
  export type OrderCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderCountOutputType
     */
    select?: OrderCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * OrderCountOutputType without action
   */
  export type OrderCountOutputTypeCountParticipantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ParticipantWhereInput
  }


  /**
   * Count Type RoleCountOutputType
   */

  export type RoleCountOutputType = {
    admins: number
  }

  export type RoleCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    admins?: boolean | RoleCountOutputTypeCountAdminsArgs
  }

  // Custom InputTypes
  /**
   * RoleCountOutputType without action
   */
  export type RoleCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleCountOutputType
     */
    select?: RoleCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * RoleCountOutputType without action
   */
  export type RoleCountOutputTypeCountAdminsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AdminWhereInput
  }


  /**
   * Count Type AdminCountOutputType
   */

  export type AdminCountOutputType = {
    logs: number
  }

  export type AdminCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    logs?: boolean | AdminCountOutputTypeCountLogsArgs
  }

  // Custom InputTypes
  /**
   * AdminCountOutputType without action
   */
  export type AdminCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminCountOutputType
     */
    select?: AdminCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AdminCountOutputType without action
   */
  export type AdminCountOutputTypeCountLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LogWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    fullName: string | null
    email: string | null
    phoneNumber: string | null
    createdAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    fullName: string | null
    email: string | null
    phoneNumber: string | null
    createdAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    fullName: number
    email: number
    phoneNumber: number
    createdAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    fullName?: true
    email?: true
    phoneNumber?: true
    createdAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    fullName?: true
    email?: true
    phoneNumber?: true
    createdAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    fullName?: true
    email?: true
    phoneNumber?: true
    createdAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    fullName: string
    email: string
    phoneNumber: string
    createdAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fullName?: boolean
    email?: boolean
    phoneNumber?: boolean
    createdAt?: boolean
    orders?: boolean | User$ordersArgs<ExtArgs>
    logs?: boolean | User$logsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fullName?: boolean
    email?: boolean
    phoneNumber?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    fullName?: boolean
    email?: boolean
    phoneNumber?: boolean
    createdAt?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    orders?: boolean | User$ordersArgs<ExtArgs>
    logs?: boolean | User$logsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      orders: Prisma.$OrderPayload<ExtArgs>[]
      logs: Prisma.$LogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      fullName: string
      email: string
      phoneNumber: string
      createdAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    orders<T extends User$ordersArgs<ExtArgs> = {}>(args?: Subset<T, User$ordersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findMany"> | Null>
    logs<T extends User$logsArgs<ExtArgs> = {}>(args?: Subset<T, User$logsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LogPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly fullName: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly phoneNumber: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }

  /**
   * User.orders
   */
  export type User$ordersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    where?: OrderWhereInput
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    cursor?: OrderWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OrderScalarFieldEnum | OrderScalarFieldEnum[]
  }

  /**
   * User.logs
   */
  export type User$logsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Log
     */
    select?: LogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LogInclude<ExtArgs> | null
    where?: LogWhereInput
    orderBy?: LogOrderByWithRelationInput | LogOrderByWithRelationInput[]
    cursor?: LogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LogScalarFieldEnum | LogScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Event
   */

  export type AggregateEvent = {
    _count: EventCountAggregateOutputType | null
    _avg: EventAvgAggregateOutputType | null
    _sum: EventSumAggregateOutputType | null
    _min: EventMinAggregateOutputType | null
    _max: EventMaxAggregateOutputType | null
  }

  export type EventAvgAggregateOutputType = {
    stock: number | null
    price: Decimal | null
  }

  export type EventSumAggregateOutputType = {
    stock: number | null
    price: Decimal | null
  }

  export type EventMinAggregateOutputType = {
    id: string | null
    ticketName: string | null
    category: string | null
    stock: number | null
    price: Decimal | null
    ticketImage: string | null
    medalImage: string | null
    eventDate: Date | null
    followGlobalTimer: boolean | null
    isClosed: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type EventMaxAggregateOutputType = {
    id: string | null
    ticketName: string | null
    category: string | null
    stock: number | null
    price: Decimal | null
    ticketImage: string | null
    medalImage: string | null
    eventDate: Date | null
    followGlobalTimer: boolean | null
    isClosed: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type EventCountAggregateOutputType = {
    id: number
    ticketName: number
    category: number
    stock: number
    price: number
    ticketImage: number
    medalImage: number
    eventDate: number
    followGlobalTimer: number
    isClosed: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type EventAvgAggregateInputType = {
    stock?: true
    price?: true
  }

  export type EventSumAggregateInputType = {
    stock?: true
    price?: true
  }

  export type EventMinAggregateInputType = {
    id?: true
    ticketName?: true
    category?: true
    stock?: true
    price?: true
    ticketImage?: true
    medalImage?: true
    eventDate?: true
    followGlobalTimer?: true
    isClosed?: true
    createdAt?: true
    updatedAt?: true
  }

  export type EventMaxAggregateInputType = {
    id?: true
    ticketName?: true
    category?: true
    stock?: true
    price?: true
    ticketImage?: true
    medalImage?: true
    eventDate?: true
    followGlobalTimer?: true
    isClosed?: true
    createdAt?: true
    updatedAt?: true
  }

  export type EventCountAggregateInputType = {
    id?: true
    ticketName?: true
    category?: true
    stock?: true
    price?: true
    ticketImage?: true
    medalImage?: true
    eventDate?: true
    followGlobalTimer?: true
    isClosed?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type EventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Event to aggregate.
     */
    where?: EventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Events to fetch.
     */
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Events
    **/
    _count?: true | EventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EventAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EventSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EventMaxAggregateInputType
  }

  export type GetEventAggregateType<T extends EventAggregateArgs> = {
        [P in keyof T & keyof AggregateEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEvent[P]>
      : GetScalarType<T[P], AggregateEvent[P]>
  }




  export type EventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EventWhereInput
    orderBy?: EventOrderByWithAggregationInput | EventOrderByWithAggregationInput[]
    by: EventScalarFieldEnum[] | EventScalarFieldEnum
    having?: EventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EventCountAggregateInputType | true
    _avg?: EventAvgAggregateInputType
    _sum?: EventSumAggregateInputType
    _min?: EventMinAggregateInputType
    _max?: EventMaxAggregateInputType
  }

  export type EventGroupByOutputType = {
    id: string
    ticketName: string
    category: string
    stock: number
    price: Decimal
    ticketImage: string | null
    medalImage: string | null
    eventDate: Date | null
    followGlobalTimer: boolean
    isClosed: boolean
    createdAt: Date
    updatedAt: Date
    _count: EventCountAggregateOutputType | null
    _avg: EventAvgAggregateOutputType | null
    _sum: EventSumAggregateOutputType | null
    _min: EventMinAggregateOutputType | null
    _max: EventMaxAggregateOutputType | null
  }

  type GetEventGroupByPayload<T extends EventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EventGroupByOutputType[P]>
            : GetScalarType<T[P], EventGroupByOutputType[P]>
        }
      >
    >


  export type EventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ticketName?: boolean
    category?: boolean
    stock?: boolean
    price?: boolean
    ticketImage?: boolean
    medalImage?: boolean
    eventDate?: boolean
    followGlobalTimer?: boolean
    isClosed?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    participants?: boolean | Event$participantsArgs<ExtArgs>
    benefits?: boolean | Event$benefitsArgs<ExtArgs>
    jerseys?: boolean | Event$jerseysArgs<ExtArgs>
    bibConfig?: boolean | Event$bibConfigArgs<ExtArgs>
    _count?: boolean | EventCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["event"]>

  export type EventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ticketName?: boolean
    category?: boolean
    stock?: boolean
    price?: boolean
    ticketImage?: boolean
    medalImage?: boolean
    eventDate?: boolean
    followGlobalTimer?: boolean
    isClosed?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["event"]>

  export type EventSelectScalar = {
    id?: boolean
    ticketName?: boolean
    category?: boolean
    stock?: boolean
    price?: boolean
    ticketImage?: boolean
    medalImage?: boolean
    eventDate?: boolean
    followGlobalTimer?: boolean
    isClosed?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type EventInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    participants?: boolean | Event$participantsArgs<ExtArgs>
    benefits?: boolean | Event$benefitsArgs<ExtArgs>
    jerseys?: boolean | Event$jerseysArgs<ExtArgs>
    bibConfig?: boolean | Event$bibConfigArgs<ExtArgs>
    _count?: boolean | EventCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type EventIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $EventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Event"
    objects: {
      participants: Prisma.$ParticipantPayload<ExtArgs>[]
      benefits: Prisma.$EventBenefitPayload<ExtArgs>[]
      jerseys: Prisma.$JerseyPayload<ExtArgs>[]
      bibConfig: Prisma.$BibConfigurationPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      ticketName: string
      category: string
      stock: number
      price: Prisma.Decimal
      ticketImage: string | null
      medalImage: string | null
      eventDate: Date | null
      followGlobalTimer: boolean
      isClosed: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["event"]>
    composites: {}
  }

  type EventGetPayload<S extends boolean | null | undefined | EventDefaultArgs> = $Result.GetResult<Prisma.$EventPayload, S>

  type EventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<EventFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: EventCountAggregateInputType | true
    }

  export interface EventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Event'], meta: { name: 'Event' } }
    /**
     * Find zero or one Event that matches the filter.
     * @param {EventFindUniqueArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EventFindUniqueArgs>(args: SelectSubset<T, EventFindUniqueArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Event that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {EventFindUniqueOrThrowArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EventFindUniqueOrThrowArgs>(args: SelectSubset<T, EventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Event that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventFindFirstArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EventFindFirstArgs>(args?: SelectSubset<T, EventFindFirstArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Event that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventFindFirstOrThrowArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EventFindFirstOrThrowArgs>(args?: SelectSubset<T, EventFindFirstOrThrowArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Events that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Events
     * const events = await prisma.event.findMany()
     * 
     * // Get first 10 Events
     * const events = await prisma.event.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const eventWithIdOnly = await prisma.event.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EventFindManyArgs>(args?: SelectSubset<T, EventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Event.
     * @param {EventCreateArgs} args - Arguments to create a Event.
     * @example
     * // Create one Event
     * const Event = await prisma.event.create({
     *   data: {
     *     // ... data to create a Event
     *   }
     * })
     * 
     */
    create<T extends EventCreateArgs>(args: SelectSubset<T, EventCreateArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Events.
     * @param {EventCreateManyArgs} args - Arguments to create many Events.
     * @example
     * // Create many Events
     * const event = await prisma.event.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EventCreateManyArgs>(args?: SelectSubset<T, EventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Events and returns the data saved in the database.
     * @param {EventCreateManyAndReturnArgs} args - Arguments to create many Events.
     * @example
     * // Create many Events
     * const event = await prisma.event.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Events and only return the `id`
     * const eventWithIdOnly = await prisma.event.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EventCreateManyAndReturnArgs>(args?: SelectSubset<T, EventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Event.
     * @param {EventDeleteArgs} args - Arguments to delete one Event.
     * @example
     * // Delete one Event
     * const Event = await prisma.event.delete({
     *   where: {
     *     // ... filter to delete one Event
     *   }
     * })
     * 
     */
    delete<T extends EventDeleteArgs>(args: SelectSubset<T, EventDeleteArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Event.
     * @param {EventUpdateArgs} args - Arguments to update one Event.
     * @example
     * // Update one Event
     * const event = await prisma.event.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EventUpdateArgs>(args: SelectSubset<T, EventUpdateArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Events.
     * @param {EventDeleteManyArgs} args - Arguments to filter Events to delete.
     * @example
     * // Delete a few Events
     * const { count } = await prisma.event.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EventDeleteManyArgs>(args?: SelectSubset<T, EventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Events.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Events
     * const event = await prisma.event.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EventUpdateManyArgs>(args: SelectSubset<T, EventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Event.
     * @param {EventUpsertArgs} args - Arguments to update or create a Event.
     * @example
     * // Update or create a Event
     * const event = await prisma.event.upsert({
     *   create: {
     *     // ... data to create a Event
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Event we want to update
     *   }
     * })
     */
    upsert<T extends EventUpsertArgs>(args: SelectSubset<T, EventUpsertArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Events.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventCountArgs} args - Arguments to filter Events to count.
     * @example
     * // Count the number of Events
     * const count = await prisma.event.count({
     *   where: {
     *     // ... the filter for the Events we want to count
     *   }
     * })
    **/
    count<T extends EventCountArgs>(
      args?: Subset<T, EventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Event.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EventAggregateArgs>(args: Subset<T, EventAggregateArgs>): Prisma.PrismaPromise<GetEventAggregateType<T>>

    /**
     * Group by Event.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EventGroupByArgs['orderBy'] }
        : { orderBy?: EventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Event model
   */
  readonly fields: EventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Event.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    participants<T extends Event$participantsArgs<ExtArgs> = {}>(args?: Subset<T, Event$participantsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ParticipantPayload<ExtArgs>, T, "findMany"> | Null>
    benefits<T extends Event$benefitsArgs<ExtArgs> = {}>(args?: Subset<T, Event$benefitsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventBenefitPayload<ExtArgs>, T, "findMany"> | Null>
    jerseys<T extends Event$jerseysArgs<ExtArgs> = {}>(args?: Subset<T, Event$jerseysArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JerseyPayload<ExtArgs>, T, "findMany"> | Null>
    bibConfig<T extends Event$bibConfigArgs<ExtArgs> = {}>(args?: Subset<T, Event$bibConfigArgs<ExtArgs>>): Prisma__BibConfigurationClient<$Result.GetResult<Prisma.$BibConfigurationPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Event model
   */ 
  interface EventFieldRefs {
    readonly id: FieldRef<"Event", 'String'>
    readonly ticketName: FieldRef<"Event", 'String'>
    readonly category: FieldRef<"Event", 'String'>
    readonly stock: FieldRef<"Event", 'Int'>
    readonly price: FieldRef<"Event", 'Decimal'>
    readonly ticketImage: FieldRef<"Event", 'String'>
    readonly medalImage: FieldRef<"Event", 'String'>
    readonly eventDate: FieldRef<"Event", 'DateTime'>
    readonly followGlobalTimer: FieldRef<"Event", 'Boolean'>
    readonly isClosed: FieldRef<"Event", 'Boolean'>
    readonly createdAt: FieldRef<"Event", 'DateTime'>
    readonly updatedAt: FieldRef<"Event", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Event findUnique
   */
  export type EventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Event to fetch.
     */
    where: EventWhereUniqueInput
  }

  /**
   * Event findUniqueOrThrow
   */
  export type EventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Event to fetch.
     */
    where: EventWhereUniqueInput
  }

  /**
   * Event findFirst
   */
  export type EventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Event to fetch.
     */
    where?: EventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Events to fetch.
     */
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Events.
     */
    cursor?: EventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Events.
     */
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[]
  }

  /**
   * Event findFirstOrThrow
   */
  export type EventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Event to fetch.
     */
    where?: EventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Events to fetch.
     */
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Events.
     */
    cursor?: EventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Events.
     */
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[]
  }

  /**
   * Event findMany
   */
  export type EventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Events to fetch.
     */
    where?: EventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Events to fetch.
     */
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Events.
     */
    cursor?: EventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Events.
     */
    skip?: number
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[]
  }

  /**
   * Event create
   */
  export type EventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * The data needed to create a Event.
     */
    data: XOR<EventCreateInput, EventUncheckedCreateInput>
  }

  /**
   * Event createMany
   */
  export type EventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Events.
     */
    data: EventCreateManyInput | EventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Event createManyAndReturn
   */
  export type EventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Events.
     */
    data: EventCreateManyInput | EventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Event update
   */
  export type EventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * The data needed to update a Event.
     */
    data: XOR<EventUpdateInput, EventUncheckedUpdateInput>
    /**
     * Choose, which Event to update.
     */
    where: EventWhereUniqueInput
  }

  /**
   * Event updateMany
   */
  export type EventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Events.
     */
    data: XOR<EventUpdateManyMutationInput, EventUncheckedUpdateManyInput>
    /**
     * Filter which Events to update
     */
    where?: EventWhereInput
  }

  /**
   * Event upsert
   */
  export type EventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * The filter to search for the Event to update in case it exists.
     */
    where: EventWhereUniqueInput
    /**
     * In case the Event found by the `where` argument doesn't exist, create a new Event with this data.
     */
    create: XOR<EventCreateInput, EventUncheckedCreateInput>
    /**
     * In case the Event was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EventUpdateInput, EventUncheckedUpdateInput>
  }

  /**
   * Event delete
   */
  export type EventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter which Event to delete.
     */
    where: EventWhereUniqueInput
  }

  /**
   * Event deleteMany
   */
  export type EventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Events to delete
     */
    where?: EventWhereInput
  }

  /**
   * Event.participants
   */
  export type Event$participantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participant
     */
    select?: ParticipantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantInclude<ExtArgs> | null
    where?: ParticipantWhereInput
    orderBy?: ParticipantOrderByWithRelationInput | ParticipantOrderByWithRelationInput[]
    cursor?: ParticipantWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ParticipantScalarFieldEnum | ParticipantScalarFieldEnum[]
  }

  /**
   * Event.benefits
   */
  export type Event$benefitsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventBenefit
     */
    select?: EventBenefitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventBenefitInclude<ExtArgs> | null
    where?: EventBenefitWhereInput
    orderBy?: EventBenefitOrderByWithRelationInput | EventBenefitOrderByWithRelationInput[]
    cursor?: EventBenefitWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EventBenefitScalarFieldEnum | EventBenefitScalarFieldEnum[]
  }

  /**
   * Event.jerseys
   */
  export type Event$jerseysArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Jersey
     */
    select?: JerseySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JerseyInclude<ExtArgs> | null
    where?: JerseyWhereInput
    orderBy?: JerseyOrderByWithRelationInput | JerseyOrderByWithRelationInput[]
    cursor?: JerseyWhereUniqueInput
    take?: number
    skip?: number
    distinct?: JerseyScalarFieldEnum | JerseyScalarFieldEnum[]
  }

  /**
   * Event.bibConfig
   */
  export type Event$bibConfigArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BibConfiguration
     */
    select?: BibConfigurationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BibConfigurationInclude<ExtArgs> | null
    where?: BibConfigurationWhereInput
  }

  /**
   * Event without action
   */
  export type EventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
  }


  /**
   * Model EventBenefit
   */

  export type AggregateEventBenefit = {
    _count: EventBenefitCountAggregateOutputType | null
    _min: EventBenefitMinAggregateOutputType | null
    _max: EventBenefitMaxAggregateOutputType | null
  }

  export type EventBenefitMinAggregateOutputType = {
    id: string | null
    eventId: string | null
    name: string | null
    description: string | null
    image: string | null
  }

  export type EventBenefitMaxAggregateOutputType = {
    id: string | null
    eventId: string | null
    name: string | null
    description: string | null
    image: string | null
  }

  export type EventBenefitCountAggregateOutputType = {
    id: number
    eventId: number
    name: number
    description: number
    image: number
    _all: number
  }


  export type EventBenefitMinAggregateInputType = {
    id?: true
    eventId?: true
    name?: true
    description?: true
    image?: true
  }

  export type EventBenefitMaxAggregateInputType = {
    id?: true
    eventId?: true
    name?: true
    description?: true
    image?: true
  }

  export type EventBenefitCountAggregateInputType = {
    id?: true
    eventId?: true
    name?: true
    description?: true
    image?: true
    _all?: true
  }

  export type EventBenefitAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EventBenefit to aggregate.
     */
    where?: EventBenefitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventBenefits to fetch.
     */
    orderBy?: EventBenefitOrderByWithRelationInput | EventBenefitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EventBenefitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventBenefits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventBenefits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned EventBenefits
    **/
    _count?: true | EventBenefitCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EventBenefitMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EventBenefitMaxAggregateInputType
  }

  export type GetEventBenefitAggregateType<T extends EventBenefitAggregateArgs> = {
        [P in keyof T & keyof AggregateEventBenefit]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEventBenefit[P]>
      : GetScalarType<T[P], AggregateEventBenefit[P]>
  }




  export type EventBenefitGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EventBenefitWhereInput
    orderBy?: EventBenefitOrderByWithAggregationInput | EventBenefitOrderByWithAggregationInput[]
    by: EventBenefitScalarFieldEnum[] | EventBenefitScalarFieldEnum
    having?: EventBenefitScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EventBenefitCountAggregateInputType | true
    _min?: EventBenefitMinAggregateInputType
    _max?: EventBenefitMaxAggregateInputType
  }

  export type EventBenefitGroupByOutputType = {
    id: string
    eventId: string
    name: string
    description: string
    image: string | null
    _count: EventBenefitCountAggregateOutputType | null
    _min: EventBenefitMinAggregateOutputType | null
    _max: EventBenefitMaxAggregateOutputType | null
  }

  type GetEventBenefitGroupByPayload<T extends EventBenefitGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EventBenefitGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EventBenefitGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EventBenefitGroupByOutputType[P]>
            : GetScalarType<T[P], EventBenefitGroupByOutputType[P]>
        }
      >
    >


  export type EventBenefitSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    eventId?: boolean
    name?: boolean
    description?: boolean
    image?: boolean
    event?: boolean | EventDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["eventBenefit"]>

  export type EventBenefitSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    eventId?: boolean
    name?: boolean
    description?: boolean
    image?: boolean
    event?: boolean | EventDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["eventBenefit"]>

  export type EventBenefitSelectScalar = {
    id?: boolean
    eventId?: boolean
    name?: boolean
    description?: boolean
    image?: boolean
  }

  export type EventBenefitInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    event?: boolean | EventDefaultArgs<ExtArgs>
  }
  export type EventBenefitIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    event?: boolean | EventDefaultArgs<ExtArgs>
  }

  export type $EventBenefitPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "EventBenefit"
    objects: {
      event: Prisma.$EventPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      eventId: string
      name: string
      description: string
      image: string | null
    }, ExtArgs["result"]["eventBenefit"]>
    composites: {}
  }

  type EventBenefitGetPayload<S extends boolean | null | undefined | EventBenefitDefaultArgs> = $Result.GetResult<Prisma.$EventBenefitPayload, S>

  type EventBenefitCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<EventBenefitFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: EventBenefitCountAggregateInputType | true
    }

  export interface EventBenefitDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['EventBenefit'], meta: { name: 'EventBenefit' } }
    /**
     * Find zero or one EventBenefit that matches the filter.
     * @param {EventBenefitFindUniqueArgs} args - Arguments to find a EventBenefit
     * @example
     * // Get one EventBenefit
     * const eventBenefit = await prisma.eventBenefit.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EventBenefitFindUniqueArgs>(args: SelectSubset<T, EventBenefitFindUniqueArgs<ExtArgs>>): Prisma__EventBenefitClient<$Result.GetResult<Prisma.$EventBenefitPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one EventBenefit that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {EventBenefitFindUniqueOrThrowArgs} args - Arguments to find a EventBenefit
     * @example
     * // Get one EventBenefit
     * const eventBenefit = await prisma.eventBenefit.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EventBenefitFindUniqueOrThrowArgs>(args: SelectSubset<T, EventBenefitFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EventBenefitClient<$Result.GetResult<Prisma.$EventBenefitPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first EventBenefit that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventBenefitFindFirstArgs} args - Arguments to find a EventBenefit
     * @example
     * // Get one EventBenefit
     * const eventBenefit = await prisma.eventBenefit.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EventBenefitFindFirstArgs>(args?: SelectSubset<T, EventBenefitFindFirstArgs<ExtArgs>>): Prisma__EventBenefitClient<$Result.GetResult<Prisma.$EventBenefitPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first EventBenefit that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventBenefitFindFirstOrThrowArgs} args - Arguments to find a EventBenefit
     * @example
     * // Get one EventBenefit
     * const eventBenefit = await prisma.eventBenefit.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EventBenefitFindFirstOrThrowArgs>(args?: SelectSubset<T, EventBenefitFindFirstOrThrowArgs<ExtArgs>>): Prisma__EventBenefitClient<$Result.GetResult<Prisma.$EventBenefitPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more EventBenefits that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventBenefitFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EventBenefits
     * const eventBenefits = await prisma.eventBenefit.findMany()
     * 
     * // Get first 10 EventBenefits
     * const eventBenefits = await prisma.eventBenefit.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const eventBenefitWithIdOnly = await prisma.eventBenefit.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EventBenefitFindManyArgs>(args?: SelectSubset<T, EventBenefitFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventBenefitPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a EventBenefit.
     * @param {EventBenefitCreateArgs} args - Arguments to create a EventBenefit.
     * @example
     * // Create one EventBenefit
     * const EventBenefit = await prisma.eventBenefit.create({
     *   data: {
     *     // ... data to create a EventBenefit
     *   }
     * })
     * 
     */
    create<T extends EventBenefitCreateArgs>(args: SelectSubset<T, EventBenefitCreateArgs<ExtArgs>>): Prisma__EventBenefitClient<$Result.GetResult<Prisma.$EventBenefitPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many EventBenefits.
     * @param {EventBenefitCreateManyArgs} args - Arguments to create many EventBenefits.
     * @example
     * // Create many EventBenefits
     * const eventBenefit = await prisma.eventBenefit.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EventBenefitCreateManyArgs>(args?: SelectSubset<T, EventBenefitCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many EventBenefits and returns the data saved in the database.
     * @param {EventBenefitCreateManyAndReturnArgs} args - Arguments to create many EventBenefits.
     * @example
     * // Create many EventBenefits
     * const eventBenefit = await prisma.eventBenefit.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many EventBenefits and only return the `id`
     * const eventBenefitWithIdOnly = await prisma.eventBenefit.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EventBenefitCreateManyAndReturnArgs>(args?: SelectSubset<T, EventBenefitCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventBenefitPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a EventBenefit.
     * @param {EventBenefitDeleteArgs} args - Arguments to delete one EventBenefit.
     * @example
     * // Delete one EventBenefit
     * const EventBenefit = await prisma.eventBenefit.delete({
     *   where: {
     *     // ... filter to delete one EventBenefit
     *   }
     * })
     * 
     */
    delete<T extends EventBenefitDeleteArgs>(args: SelectSubset<T, EventBenefitDeleteArgs<ExtArgs>>): Prisma__EventBenefitClient<$Result.GetResult<Prisma.$EventBenefitPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one EventBenefit.
     * @param {EventBenefitUpdateArgs} args - Arguments to update one EventBenefit.
     * @example
     * // Update one EventBenefit
     * const eventBenefit = await prisma.eventBenefit.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EventBenefitUpdateArgs>(args: SelectSubset<T, EventBenefitUpdateArgs<ExtArgs>>): Prisma__EventBenefitClient<$Result.GetResult<Prisma.$EventBenefitPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more EventBenefits.
     * @param {EventBenefitDeleteManyArgs} args - Arguments to filter EventBenefits to delete.
     * @example
     * // Delete a few EventBenefits
     * const { count } = await prisma.eventBenefit.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EventBenefitDeleteManyArgs>(args?: SelectSubset<T, EventBenefitDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EventBenefits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventBenefitUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EventBenefits
     * const eventBenefit = await prisma.eventBenefit.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EventBenefitUpdateManyArgs>(args: SelectSubset<T, EventBenefitUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one EventBenefit.
     * @param {EventBenefitUpsertArgs} args - Arguments to update or create a EventBenefit.
     * @example
     * // Update or create a EventBenefit
     * const eventBenefit = await prisma.eventBenefit.upsert({
     *   create: {
     *     // ... data to create a EventBenefit
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EventBenefit we want to update
     *   }
     * })
     */
    upsert<T extends EventBenefitUpsertArgs>(args: SelectSubset<T, EventBenefitUpsertArgs<ExtArgs>>): Prisma__EventBenefitClient<$Result.GetResult<Prisma.$EventBenefitPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of EventBenefits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventBenefitCountArgs} args - Arguments to filter EventBenefits to count.
     * @example
     * // Count the number of EventBenefits
     * const count = await prisma.eventBenefit.count({
     *   where: {
     *     // ... the filter for the EventBenefits we want to count
     *   }
     * })
    **/
    count<T extends EventBenefitCountArgs>(
      args?: Subset<T, EventBenefitCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EventBenefitCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EventBenefit.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventBenefitAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EventBenefitAggregateArgs>(args: Subset<T, EventBenefitAggregateArgs>): Prisma.PrismaPromise<GetEventBenefitAggregateType<T>>

    /**
     * Group by EventBenefit.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventBenefitGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EventBenefitGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EventBenefitGroupByArgs['orderBy'] }
        : { orderBy?: EventBenefitGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EventBenefitGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEventBenefitGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the EventBenefit model
   */
  readonly fields: EventBenefitFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for EventBenefit.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EventBenefitClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    event<T extends EventDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EventDefaultArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the EventBenefit model
   */ 
  interface EventBenefitFieldRefs {
    readonly id: FieldRef<"EventBenefit", 'String'>
    readonly eventId: FieldRef<"EventBenefit", 'String'>
    readonly name: FieldRef<"EventBenefit", 'String'>
    readonly description: FieldRef<"EventBenefit", 'String'>
    readonly image: FieldRef<"EventBenefit", 'String'>
  }
    

  // Custom InputTypes
  /**
   * EventBenefit findUnique
   */
  export type EventBenefitFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventBenefit
     */
    select?: EventBenefitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventBenefitInclude<ExtArgs> | null
    /**
     * Filter, which EventBenefit to fetch.
     */
    where: EventBenefitWhereUniqueInput
  }

  /**
   * EventBenefit findUniqueOrThrow
   */
  export type EventBenefitFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventBenefit
     */
    select?: EventBenefitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventBenefitInclude<ExtArgs> | null
    /**
     * Filter, which EventBenefit to fetch.
     */
    where: EventBenefitWhereUniqueInput
  }

  /**
   * EventBenefit findFirst
   */
  export type EventBenefitFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventBenefit
     */
    select?: EventBenefitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventBenefitInclude<ExtArgs> | null
    /**
     * Filter, which EventBenefit to fetch.
     */
    where?: EventBenefitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventBenefits to fetch.
     */
    orderBy?: EventBenefitOrderByWithRelationInput | EventBenefitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EventBenefits.
     */
    cursor?: EventBenefitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventBenefits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventBenefits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EventBenefits.
     */
    distinct?: EventBenefitScalarFieldEnum | EventBenefitScalarFieldEnum[]
  }

  /**
   * EventBenefit findFirstOrThrow
   */
  export type EventBenefitFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventBenefit
     */
    select?: EventBenefitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventBenefitInclude<ExtArgs> | null
    /**
     * Filter, which EventBenefit to fetch.
     */
    where?: EventBenefitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventBenefits to fetch.
     */
    orderBy?: EventBenefitOrderByWithRelationInput | EventBenefitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EventBenefits.
     */
    cursor?: EventBenefitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventBenefits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventBenefits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EventBenefits.
     */
    distinct?: EventBenefitScalarFieldEnum | EventBenefitScalarFieldEnum[]
  }

  /**
   * EventBenefit findMany
   */
  export type EventBenefitFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventBenefit
     */
    select?: EventBenefitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventBenefitInclude<ExtArgs> | null
    /**
     * Filter, which EventBenefits to fetch.
     */
    where?: EventBenefitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventBenefits to fetch.
     */
    orderBy?: EventBenefitOrderByWithRelationInput | EventBenefitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing EventBenefits.
     */
    cursor?: EventBenefitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventBenefits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventBenefits.
     */
    skip?: number
    distinct?: EventBenefitScalarFieldEnum | EventBenefitScalarFieldEnum[]
  }

  /**
   * EventBenefit create
   */
  export type EventBenefitCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventBenefit
     */
    select?: EventBenefitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventBenefitInclude<ExtArgs> | null
    /**
     * The data needed to create a EventBenefit.
     */
    data: XOR<EventBenefitCreateInput, EventBenefitUncheckedCreateInput>
  }

  /**
   * EventBenefit createMany
   */
  export type EventBenefitCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many EventBenefits.
     */
    data: EventBenefitCreateManyInput | EventBenefitCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EventBenefit createManyAndReturn
   */
  export type EventBenefitCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventBenefit
     */
    select?: EventBenefitSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many EventBenefits.
     */
    data: EventBenefitCreateManyInput | EventBenefitCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventBenefitIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * EventBenefit update
   */
  export type EventBenefitUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventBenefit
     */
    select?: EventBenefitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventBenefitInclude<ExtArgs> | null
    /**
     * The data needed to update a EventBenefit.
     */
    data: XOR<EventBenefitUpdateInput, EventBenefitUncheckedUpdateInput>
    /**
     * Choose, which EventBenefit to update.
     */
    where: EventBenefitWhereUniqueInput
  }

  /**
   * EventBenefit updateMany
   */
  export type EventBenefitUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update EventBenefits.
     */
    data: XOR<EventBenefitUpdateManyMutationInput, EventBenefitUncheckedUpdateManyInput>
    /**
     * Filter which EventBenefits to update
     */
    where?: EventBenefitWhereInput
  }

  /**
   * EventBenefit upsert
   */
  export type EventBenefitUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventBenefit
     */
    select?: EventBenefitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventBenefitInclude<ExtArgs> | null
    /**
     * The filter to search for the EventBenefit to update in case it exists.
     */
    where: EventBenefitWhereUniqueInput
    /**
     * In case the EventBenefit found by the `where` argument doesn't exist, create a new EventBenefit with this data.
     */
    create: XOR<EventBenefitCreateInput, EventBenefitUncheckedCreateInput>
    /**
     * In case the EventBenefit was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EventBenefitUpdateInput, EventBenefitUncheckedUpdateInput>
  }

  /**
   * EventBenefit delete
   */
  export type EventBenefitDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventBenefit
     */
    select?: EventBenefitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventBenefitInclude<ExtArgs> | null
    /**
     * Filter which EventBenefit to delete.
     */
    where: EventBenefitWhereUniqueInput
  }

  /**
   * EventBenefit deleteMany
   */
  export type EventBenefitDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EventBenefits to delete
     */
    where?: EventBenefitWhereInput
  }

  /**
   * EventBenefit without action
   */
  export type EventBenefitDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventBenefit
     */
    select?: EventBenefitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventBenefitInclude<ExtArgs> | null
  }


  /**
   * Model Jersey
   */

  export type AggregateJersey = {
    _count: JerseyCountAggregateOutputType | null
    _min: JerseyMinAggregateOutputType | null
    _max: JerseyMaxAggregateOutputType | null
  }

  export type JerseyMinAggregateOutputType = {
    id: string | null
    eventId: string | null
    name: string | null
    type: string | null
    image: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type JerseyMaxAggregateOutputType = {
    id: string | null
    eventId: string | null
    name: string | null
    type: string | null
    image: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type JerseyCountAggregateOutputType = {
    id: number
    eventId: number
    name: number
    type: number
    sizes: number
    image: number
    bannerImages: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type JerseyMinAggregateInputType = {
    id?: true
    eventId?: true
    name?: true
    type?: true
    image?: true
    createdAt?: true
    updatedAt?: true
  }

  export type JerseyMaxAggregateInputType = {
    id?: true
    eventId?: true
    name?: true
    type?: true
    image?: true
    createdAt?: true
    updatedAt?: true
  }

  export type JerseyCountAggregateInputType = {
    id?: true
    eventId?: true
    name?: true
    type?: true
    sizes?: true
    image?: true
    bannerImages?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type JerseyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Jersey to aggregate.
     */
    where?: JerseyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Jerseys to fetch.
     */
    orderBy?: JerseyOrderByWithRelationInput | JerseyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: JerseyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Jerseys from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Jerseys.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Jerseys
    **/
    _count?: true | JerseyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: JerseyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: JerseyMaxAggregateInputType
  }

  export type GetJerseyAggregateType<T extends JerseyAggregateArgs> = {
        [P in keyof T & keyof AggregateJersey]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateJersey[P]>
      : GetScalarType<T[P], AggregateJersey[P]>
  }




  export type JerseyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JerseyWhereInput
    orderBy?: JerseyOrderByWithAggregationInput | JerseyOrderByWithAggregationInput[]
    by: JerseyScalarFieldEnum[] | JerseyScalarFieldEnum
    having?: JerseyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: JerseyCountAggregateInputType | true
    _min?: JerseyMinAggregateInputType
    _max?: JerseyMaxAggregateInputType
  }

  export type JerseyGroupByOutputType = {
    id: string
    eventId: string
    name: string
    type: string
    sizes: JsonValue
    image: string | null
    bannerImages: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: JerseyCountAggregateOutputType | null
    _min: JerseyMinAggregateOutputType | null
    _max: JerseyMaxAggregateOutputType | null
  }

  type GetJerseyGroupByPayload<T extends JerseyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<JerseyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof JerseyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], JerseyGroupByOutputType[P]>
            : GetScalarType<T[P], JerseyGroupByOutputType[P]>
        }
      >
    >


  export type JerseySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    eventId?: boolean
    name?: boolean
    type?: boolean
    sizes?: boolean
    image?: boolean
    bannerImages?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    event?: boolean | EventDefaultArgs<ExtArgs>
    participants?: boolean | Jersey$participantsArgs<ExtArgs>
    _count?: boolean | JerseyCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["jersey"]>

  export type JerseySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    eventId?: boolean
    name?: boolean
    type?: boolean
    sizes?: boolean
    image?: boolean
    bannerImages?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    event?: boolean | EventDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["jersey"]>

  export type JerseySelectScalar = {
    id?: boolean
    eventId?: boolean
    name?: boolean
    type?: boolean
    sizes?: boolean
    image?: boolean
    bannerImages?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type JerseyInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    event?: boolean | EventDefaultArgs<ExtArgs>
    participants?: boolean | Jersey$participantsArgs<ExtArgs>
    _count?: boolean | JerseyCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type JerseyIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    event?: boolean | EventDefaultArgs<ExtArgs>
  }

  export type $JerseyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Jersey"
    objects: {
      event: Prisma.$EventPayload<ExtArgs>
      participants: Prisma.$ParticipantPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      eventId: string
      name: string
      type: string
      sizes: Prisma.JsonValue
      image: string | null
      bannerImages: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["jersey"]>
    composites: {}
  }

  type JerseyGetPayload<S extends boolean | null | undefined | JerseyDefaultArgs> = $Result.GetResult<Prisma.$JerseyPayload, S>

  type JerseyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<JerseyFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: JerseyCountAggregateInputType | true
    }

  export interface JerseyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Jersey'], meta: { name: 'Jersey' } }
    /**
     * Find zero or one Jersey that matches the filter.
     * @param {JerseyFindUniqueArgs} args - Arguments to find a Jersey
     * @example
     * // Get one Jersey
     * const jersey = await prisma.jersey.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends JerseyFindUniqueArgs>(args: SelectSubset<T, JerseyFindUniqueArgs<ExtArgs>>): Prisma__JerseyClient<$Result.GetResult<Prisma.$JerseyPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Jersey that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {JerseyFindUniqueOrThrowArgs} args - Arguments to find a Jersey
     * @example
     * // Get one Jersey
     * const jersey = await prisma.jersey.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends JerseyFindUniqueOrThrowArgs>(args: SelectSubset<T, JerseyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__JerseyClient<$Result.GetResult<Prisma.$JerseyPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Jersey that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JerseyFindFirstArgs} args - Arguments to find a Jersey
     * @example
     * // Get one Jersey
     * const jersey = await prisma.jersey.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends JerseyFindFirstArgs>(args?: SelectSubset<T, JerseyFindFirstArgs<ExtArgs>>): Prisma__JerseyClient<$Result.GetResult<Prisma.$JerseyPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Jersey that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JerseyFindFirstOrThrowArgs} args - Arguments to find a Jersey
     * @example
     * // Get one Jersey
     * const jersey = await prisma.jersey.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends JerseyFindFirstOrThrowArgs>(args?: SelectSubset<T, JerseyFindFirstOrThrowArgs<ExtArgs>>): Prisma__JerseyClient<$Result.GetResult<Prisma.$JerseyPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Jerseys that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JerseyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Jerseys
     * const jerseys = await prisma.jersey.findMany()
     * 
     * // Get first 10 Jerseys
     * const jerseys = await prisma.jersey.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const jerseyWithIdOnly = await prisma.jersey.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends JerseyFindManyArgs>(args?: SelectSubset<T, JerseyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JerseyPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Jersey.
     * @param {JerseyCreateArgs} args - Arguments to create a Jersey.
     * @example
     * // Create one Jersey
     * const Jersey = await prisma.jersey.create({
     *   data: {
     *     // ... data to create a Jersey
     *   }
     * })
     * 
     */
    create<T extends JerseyCreateArgs>(args: SelectSubset<T, JerseyCreateArgs<ExtArgs>>): Prisma__JerseyClient<$Result.GetResult<Prisma.$JerseyPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Jerseys.
     * @param {JerseyCreateManyArgs} args - Arguments to create many Jerseys.
     * @example
     * // Create many Jerseys
     * const jersey = await prisma.jersey.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends JerseyCreateManyArgs>(args?: SelectSubset<T, JerseyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Jerseys and returns the data saved in the database.
     * @param {JerseyCreateManyAndReturnArgs} args - Arguments to create many Jerseys.
     * @example
     * // Create many Jerseys
     * const jersey = await prisma.jersey.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Jerseys and only return the `id`
     * const jerseyWithIdOnly = await prisma.jersey.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends JerseyCreateManyAndReturnArgs>(args?: SelectSubset<T, JerseyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JerseyPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Jersey.
     * @param {JerseyDeleteArgs} args - Arguments to delete one Jersey.
     * @example
     * // Delete one Jersey
     * const Jersey = await prisma.jersey.delete({
     *   where: {
     *     // ... filter to delete one Jersey
     *   }
     * })
     * 
     */
    delete<T extends JerseyDeleteArgs>(args: SelectSubset<T, JerseyDeleteArgs<ExtArgs>>): Prisma__JerseyClient<$Result.GetResult<Prisma.$JerseyPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Jersey.
     * @param {JerseyUpdateArgs} args - Arguments to update one Jersey.
     * @example
     * // Update one Jersey
     * const jersey = await prisma.jersey.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends JerseyUpdateArgs>(args: SelectSubset<T, JerseyUpdateArgs<ExtArgs>>): Prisma__JerseyClient<$Result.GetResult<Prisma.$JerseyPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Jerseys.
     * @param {JerseyDeleteManyArgs} args - Arguments to filter Jerseys to delete.
     * @example
     * // Delete a few Jerseys
     * const { count } = await prisma.jersey.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends JerseyDeleteManyArgs>(args?: SelectSubset<T, JerseyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Jerseys.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JerseyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Jerseys
     * const jersey = await prisma.jersey.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends JerseyUpdateManyArgs>(args: SelectSubset<T, JerseyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Jersey.
     * @param {JerseyUpsertArgs} args - Arguments to update or create a Jersey.
     * @example
     * // Update or create a Jersey
     * const jersey = await prisma.jersey.upsert({
     *   create: {
     *     // ... data to create a Jersey
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Jersey we want to update
     *   }
     * })
     */
    upsert<T extends JerseyUpsertArgs>(args: SelectSubset<T, JerseyUpsertArgs<ExtArgs>>): Prisma__JerseyClient<$Result.GetResult<Prisma.$JerseyPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Jerseys.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JerseyCountArgs} args - Arguments to filter Jerseys to count.
     * @example
     * // Count the number of Jerseys
     * const count = await prisma.jersey.count({
     *   where: {
     *     // ... the filter for the Jerseys we want to count
     *   }
     * })
    **/
    count<T extends JerseyCountArgs>(
      args?: Subset<T, JerseyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], JerseyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Jersey.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JerseyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends JerseyAggregateArgs>(args: Subset<T, JerseyAggregateArgs>): Prisma.PrismaPromise<GetJerseyAggregateType<T>>

    /**
     * Group by Jersey.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JerseyGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends JerseyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: JerseyGroupByArgs['orderBy'] }
        : { orderBy?: JerseyGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, JerseyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetJerseyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Jersey model
   */
  readonly fields: JerseyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Jersey.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__JerseyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    event<T extends EventDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EventDefaultArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    participants<T extends Jersey$participantsArgs<ExtArgs> = {}>(args?: Subset<T, Jersey$participantsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ParticipantPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Jersey model
   */ 
  interface JerseyFieldRefs {
    readonly id: FieldRef<"Jersey", 'String'>
    readonly eventId: FieldRef<"Jersey", 'String'>
    readonly name: FieldRef<"Jersey", 'String'>
    readonly type: FieldRef<"Jersey", 'String'>
    readonly sizes: FieldRef<"Jersey", 'Json'>
    readonly image: FieldRef<"Jersey", 'String'>
    readonly bannerImages: FieldRef<"Jersey", 'Json'>
    readonly createdAt: FieldRef<"Jersey", 'DateTime'>
    readonly updatedAt: FieldRef<"Jersey", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Jersey findUnique
   */
  export type JerseyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Jersey
     */
    select?: JerseySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JerseyInclude<ExtArgs> | null
    /**
     * Filter, which Jersey to fetch.
     */
    where: JerseyWhereUniqueInput
  }

  /**
   * Jersey findUniqueOrThrow
   */
  export type JerseyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Jersey
     */
    select?: JerseySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JerseyInclude<ExtArgs> | null
    /**
     * Filter, which Jersey to fetch.
     */
    where: JerseyWhereUniqueInput
  }

  /**
   * Jersey findFirst
   */
  export type JerseyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Jersey
     */
    select?: JerseySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JerseyInclude<ExtArgs> | null
    /**
     * Filter, which Jersey to fetch.
     */
    where?: JerseyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Jerseys to fetch.
     */
    orderBy?: JerseyOrderByWithRelationInput | JerseyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Jerseys.
     */
    cursor?: JerseyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Jerseys from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Jerseys.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Jerseys.
     */
    distinct?: JerseyScalarFieldEnum | JerseyScalarFieldEnum[]
  }

  /**
   * Jersey findFirstOrThrow
   */
  export type JerseyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Jersey
     */
    select?: JerseySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JerseyInclude<ExtArgs> | null
    /**
     * Filter, which Jersey to fetch.
     */
    where?: JerseyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Jerseys to fetch.
     */
    orderBy?: JerseyOrderByWithRelationInput | JerseyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Jerseys.
     */
    cursor?: JerseyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Jerseys from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Jerseys.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Jerseys.
     */
    distinct?: JerseyScalarFieldEnum | JerseyScalarFieldEnum[]
  }

  /**
   * Jersey findMany
   */
  export type JerseyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Jersey
     */
    select?: JerseySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JerseyInclude<ExtArgs> | null
    /**
     * Filter, which Jerseys to fetch.
     */
    where?: JerseyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Jerseys to fetch.
     */
    orderBy?: JerseyOrderByWithRelationInput | JerseyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Jerseys.
     */
    cursor?: JerseyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Jerseys from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Jerseys.
     */
    skip?: number
    distinct?: JerseyScalarFieldEnum | JerseyScalarFieldEnum[]
  }

  /**
   * Jersey create
   */
  export type JerseyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Jersey
     */
    select?: JerseySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JerseyInclude<ExtArgs> | null
    /**
     * The data needed to create a Jersey.
     */
    data: XOR<JerseyCreateInput, JerseyUncheckedCreateInput>
  }

  /**
   * Jersey createMany
   */
  export type JerseyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Jerseys.
     */
    data: JerseyCreateManyInput | JerseyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Jersey createManyAndReturn
   */
  export type JerseyCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Jersey
     */
    select?: JerseySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Jerseys.
     */
    data: JerseyCreateManyInput | JerseyCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JerseyIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Jersey update
   */
  export type JerseyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Jersey
     */
    select?: JerseySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JerseyInclude<ExtArgs> | null
    /**
     * The data needed to update a Jersey.
     */
    data: XOR<JerseyUpdateInput, JerseyUncheckedUpdateInput>
    /**
     * Choose, which Jersey to update.
     */
    where: JerseyWhereUniqueInput
  }

  /**
   * Jersey updateMany
   */
  export type JerseyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Jerseys.
     */
    data: XOR<JerseyUpdateManyMutationInput, JerseyUncheckedUpdateManyInput>
    /**
     * Filter which Jerseys to update
     */
    where?: JerseyWhereInput
  }

  /**
   * Jersey upsert
   */
  export type JerseyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Jersey
     */
    select?: JerseySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JerseyInclude<ExtArgs> | null
    /**
     * The filter to search for the Jersey to update in case it exists.
     */
    where: JerseyWhereUniqueInput
    /**
     * In case the Jersey found by the `where` argument doesn't exist, create a new Jersey with this data.
     */
    create: XOR<JerseyCreateInput, JerseyUncheckedCreateInput>
    /**
     * In case the Jersey was found with the provided `where` argument, update it with this data.
     */
    update: XOR<JerseyUpdateInput, JerseyUncheckedUpdateInput>
  }

  /**
   * Jersey delete
   */
  export type JerseyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Jersey
     */
    select?: JerseySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JerseyInclude<ExtArgs> | null
    /**
     * Filter which Jersey to delete.
     */
    where: JerseyWhereUniqueInput
  }

  /**
   * Jersey deleteMany
   */
  export type JerseyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Jerseys to delete
     */
    where?: JerseyWhereInput
  }

  /**
   * Jersey.participants
   */
  export type Jersey$participantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participant
     */
    select?: ParticipantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantInclude<ExtArgs> | null
    where?: ParticipantWhereInput
    orderBy?: ParticipantOrderByWithRelationInput | ParticipantOrderByWithRelationInput[]
    cursor?: ParticipantWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ParticipantScalarFieldEnum | ParticipantScalarFieldEnum[]
  }

  /**
   * Jersey without action
   */
  export type JerseyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Jersey
     */
    select?: JerseySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JerseyInclude<ExtArgs> | null
  }


  /**
   * Model Order
   */

  export type AggregateOrder = {
    _count: OrderCountAggregateOutputType | null
    _avg: OrderAvgAggregateOutputType | null
    _sum: OrderSumAggregateOutputType | null
    _min: OrderMinAggregateOutputType | null
    _max: OrderMaxAggregateOutputType | null
  }

  export type OrderAvgAggregateOutputType = {
    totalAmount: Decimal | null
  }

  export type OrderSumAggregateOutputType = {
    totalAmount: Decimal | null
  }

  export type OrderMinAggregateOutputType = {
    id: string | null
    userId: string | null
    totalAmount: Decimal | null
    status: $Enums.OrderStatus | null
    midtransOrderId: string | null
    snapToken: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OrderMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    totalAmount: Decimal | null
    status: $Enums.OrderStatus | null
    midtransOrderId: string | null
    snapToken: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OrderCountAggregateOutputType = {
    id: number
    userId: number
    totalAmount: number
    status: number
    midtransOrderId: number
    snapToken: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type OrderAvgAggregateInputType = {
    totalAmount?: true
  }

  export type OrderSumAggregateInputType = {
    totalAmount?: true
  }

  export type OrderMinAggregateInputType = {
    id?: true
    userId?: true
    totalAmount?: true
    status?: true
    midtransOrderId?: true
    snapToken?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OrderMaxAggregateInputType = {
    id?: true
    userId?: true
    totalAmount?: true
    status?: true
    midtransOrderId?: true
    snapToken?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OrderCountAggregateInputType = {
    id?: true
    userId?: true
    totalAmount?: true
    status?: true
    midtransOrderId?: true
    snapToken?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type OrderAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Order to aggregate.
     */
    where?: OrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Orders to fetch.
     */
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Orders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Orders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Orders
    **/
    _count?: true | OrderCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: OrderAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: OrderSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OrderMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OrderMaxAggregateInputType
  }

  export type GetOrderAggregateType<T extends OrderAggregateArgs> = {
        [P in keyof T & keyof AggregateOrder]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOrder[P]>
      : GetScalarType<T[P], AggregateOrder[P]>
  }




  export type OrderGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrderWhereInput
    orderBy?: OrderOrderByWithAggregationInput | OrderOrderByWithAggregationInput[]
    by: OrderScalarFieldEnum[] | OrderScalarFieldEnum
    having?: OrderScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OrderCountAggregateInputType | true
    _avg?: OrderAvgAggregateInputType
    _sum?: OrderSumAggregateInputType
    _min?: OrderMinAggregateInputType
    _max?: OrderMaxAggregateInputType
  }

  export type OrderGroupByOutputType = {
    id: string
    userId: string
    totalAmount: Decimal
    status: $Enums.OrderStatus
    midtransOrderId: string | null
    snapToken: string | null
    createdAt: Date
    updatedAt: Date
    _count: OrderCountAggregateOutputType | null
    _avg: OrderAvgAggregateOutputType | null
    _sum: OrderSumAggregateOutputType | null
    _min: OrderMinAggregateOutputType | null
    _max: OrderMaxAggregateOutputType | null
  }

  type GetOrderGroupByPayload<T extends OrderGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OrderGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OrderGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OrderGroupByOutputType[P]>
            : GetScalarType<T[P], OrderGroupByOutputType[P]>
        }
      >
    >


  export type OrderSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    totalAmount?: boolean
    status?: boolean
    midtransOrderId?: boolean
    snapToken?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    participants?: boolean | Order$participantsArgs<ExtArgs>
    masterQrToken?: boolean | Order$masterQrTokenArgs<ExtArgs>
    _count?: boolean | OrderCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["order"]>

  export type OrderSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    totalAmount?: boolean
    status?: boolean
    midtransOrderId?: boolean
    snapToken?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["order"]>

  export type OrderSelectScalar = {
    id?: boolean
    userId?: boolean
    totalAmount?: boolean
    status?: boolean
    midtransOrderId?: boolean
    snapToken?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type OrderInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    participants?: boolean | Order$participantsArgs<ExtArgs>
    masterQrToken?: boolean | Order$masterQrTokenArgs<ExtArgs>
    _count?: boolean | OrderCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type OrderIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $OrderPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Order"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      participants: Prisma.$ParticipantPayload<ExtArgs>[]
      masterQrToken: Prisma.$QrTokenPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      totalAmount: Prisma.Decimal
      status: $Enums.OrderStatus
      midtransOrderId: string | null
      snapToken: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["order"]>
    composites: {}
  }

  type OrderGetPayload<S extends boolean | null | undefined | OrderDefaultArgs> = $Result.GetResult<Prisma.$OrderPayload, S>

  type OrderCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<OrderFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: OrderCountAggregateInputType | true
    }

  export interface OrderDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Order'], meta: { name: 'Order' } }
    /**
     * Find zero or one Order that matches the filter.
     * @param {OrderFindUniqueArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OrderFindUniqueArgs>(args: SelectSubset<T, OrderFindUniqueArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Order that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {OrderFindUniqueOrThrowArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OrderFindUniqueOrThrowArgs>(args: SelectSubset<T, OrderFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Order that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderFindFirstArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OrderFindFirstArgs>(args?: SelectSubset<T, OrderFindFirstArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Order that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderFindFirstOrThrowArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OrderFindFirstOrThrowArgs>(args?: SelectSubset<T, OrderFindFirstOrThrowArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Orders that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Orders
     * const orders = await prisma.order.findMany()
     * 
     * // Get first 10 Orders
     * const orders = await prisma.order.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const orderWithIdOnly = await prisma.order.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OrderFindManyArgs>(args?: SelectSubset<T, OrderFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Order.
     * @param {OrderCreateArgs} args - Arguments to create a Order.
     * @example
     * // Create one Order
     * const Order = await prisma.order.create({
     *   data: {
     *     // ... data to create a Order
     *   }
     * })
     * 
     */
    create<T extends OrderCreateArgs>(args: SelectSubset<T, OrderCreateArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Orders.
     * @param {OrderCreateManyArgs} args - Arguments to create many Orders.
     * @example
     * // Create many Orders
     * const order = await prisma.order.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OrderCreateManyArgs>(args?: SelectSubset<T, OrderCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Orders and returns the data saved in the database.
     * @param {OrderCreateManyAndReturnArgs} args - Arguments to create many Orders.
     * @example
     * // Create many Orders
     * const order = await prisma.order.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Orders and only return the `id`
     * const orderWithIdOnly = await prisma.order.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OrderCreateManyAndReturnArgs>(args?: SelectSubset<T, OrderCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Order.
     * @param {OrderDeleteArgs} args - Arguments to delete one Order.
     * @example
     * // Delete one Order
     * const Order = await prisma.order.delete({
     *   where: {
     *     // ... filter to delete one Order
     *   }
     * })
     * 
     */
    delete<T extends OrderDeleteArgs>(args: SelectSubset<T, OrderDeleteArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Order.
     * @param {OrderUpdateArgs} args - Arguments to update one Order.
     * @example
     * // Update one Order
     * const order = await prisma.order.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OrderUpdateArgs>(args: SelectSubset<T, OrderUpdateArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Orders.
     * @param {OrderDeleteManyArgs} args - Arguments to filter Orders to delete.
     * @example
     * // Delete a few Orders
     * const { count } = await prisma.order.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OrderDeleteManyArgs>(args?: SelectSubset<T, OrderDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Orders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Orders
     * const order = await prisma.order.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OrderUpdateManyArgs>(args: SelectSubset<T, OrderUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Order.
     * @param {OrderUpsertArgs} args - Arguments to update or create a Order.
     * @example
     * // Update or create a Order
     * const order = await prisma.order.upsert({
     *   create: {
     *     // ... data to create a Order
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Order we want to update
     *   }
     * })
     */
    upsert<T extends OrderUpsertArgs>(args: SelectSubset<T, OrderUpsertArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Orders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderCountArgs} args - Arguments to filter Orders to count.
     * @example
     * // Count the number of Orders
     * const count = await prisma.order.count({
     *   where: {
     *     // ... the filter for the Orders we want to count
     *   }
     * })
    **/
    count<T extends OrderCountArgs>(
      args?: Subset<T, OrderCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OrderCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Order.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OrderAggregateArgs>(args: Subset<T, OrderAggregateArgs>): Prisma.PrismaPromise<GetOrderAggregateType<T>>

    /**
     * Group by Order.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OrderGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OrderGroupByArgs['orderBy'] }
        : { orderBy?: OrderGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OrderGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrderGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Order model
   */
  readonly fields: OrderFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Order.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OrderClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    participants<T extends Order$participantsArgs<ExtArgs> = {}>(args?: Subset<T, Order$participantsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ParticipantPayload<ExtArgs>, T, "findMany"> | Null>
    masterQrToken<T extends Order$masterQrTokenArgs<ExtArgs> = {}>(args?: Subset<T, Order$masterQrTokenArgs<ExtArgs>>): Prisma__QrTokenClient<$Result.GetResult<Prisma.$QrTokenPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Order model
   */ 
  interface OrderFieldRefs {
    readonly id: FieldRef<"Order", 'String'>
    readonly userId: FieldRef<"Order", 'String'>
    readonly totalAmount: FieldRef<"Order", 'Decimal'>
    readonly status: FieldRef<"Order", 'OrderStatus'>
    readonly midtransOrderId: FieldRef<"Order", 'String'>
    readonly snapToken: FieldRef<"Order", 'String'>
    readonly createdAt: FieldRef<"Order", 'DateTime'>
    readonly updatedAt: FieldRef<"Order", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Order findUnique
   */
  export type OrderFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter, which Order to fetch.
     */
    where: OrderWhereUniqueInput
  }

  /**
   * Order findUniqueOrThrow
   */
  export type OrderFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter, which Order to fetch.
     */
    where: OrderWhereUniqueInput
  }

  /**
   * Order findFirst
   */
  export type OrderFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter, which Order to fetch.
     */
    where?: OrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Orders to fetch.
     */
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Orders.
     */
    cursor?: OrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Orders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Orders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Orders.
     */
    distinct?: OrderScalarFieldEnum | OrderScalarFieldEnum[]
  }

  /**
   * Order findFirstOrThrow
   */
  export type OrderFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter, which Order to fetch.
     */
    where?: OrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Orders to fetch.
     */
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Orders.
     */
    cursor?: OrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Orders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Orders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Orders.
     */
    distinct?: OrderScalarFieldEnum | OrderScalarFieldEnum[]
  }

  /**
   * Order findMany
   */
  export type OrderFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter, which Orders to fetch.
     */
    where?: OrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Orders to fetch.
     */
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Orders.
     */
    cursor?: OrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Orders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Orders.
     */
    skip?: number
    distinct?: OrderScalarFieldEnum | OrderScalarFieldEnum[]
  }

  /**
   * Order create
   */
  export type OrderCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * The data needed to create a Order.
     */
    data: XOR<OrderCreateInput, OrderUncheckedCreateInput>
  }

  /**
   * Order createMany
   */
  export type OrderCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Orders.
     */
    data: OrderCreateManyInput | OrderCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Order createManyAndReturn
   */
  export type OrderCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Orders.
     */
    data: OrderCreateManyInput | OrderCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Order update
   */
  export type OrderUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * The data needed to update a Order.
     */
    data: XOR<OrderUpdateInput, OrderUncheckedUpdateInput>
    /**
     * Choose, which Order to update.
     */
    where: OrderWhereUniqueInput
  }

  /**
   * Order updateMany
   */
  export type OrderUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Orders.
     */
    data: XOR<OrderUpdateManyMutationInput, OrderUncheckedUpdateManyInput>
    /**
     * Filter which Orders to update
     */
    where?: OrderWhereInput
  }

  /**
   * Order upsert
   */
  export type OrderUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * The filter to search for the Order to update in case it exists.
     */
    where: OrderWhereUniqueInput
    /**
     * In case the Order found by the `where` argument doesn't exist, create a new Order with this data.
     */
    create: XOR<OrderCreateInput, OrderUncheckedCreateInput>
    /**
     * In case the Order was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OrderUpdateInput, OrderUncheckedUpdateInput>
  }

  /**
   * Order delete
   */
  export type OrderDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter which Order to delete.
     */
    where: OrderWhereUniqueInput
  }

  /**
   * Order deleteMany
   */
  export type OrderDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Orders to delete
     */
    where?: OrderWhereInput
  }

  /**
   * Order.participants
   */
  export type Order$participantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participant
     */
    select?: ParticipantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantInclude<ExtArgs> | null
    where?: ParticipantWhereInput
    orderBy?: ParticipantOrderByWithRelationInput | ParticipantOrderByWithRelationInput[]
    cursor?: ParticipantWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ParticipantScalarFieldEnum | ParticipantScalarFieldEnum[]
  }

  /**
   * Order.masterQrToken
   */
  export type Order$masterQrTokenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QrToken
     */
    select?: QrTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QrTokenInclude<ExtArgs> | null
    where?: QrTokenWhereInput
  }

  /**
   * Order without action
   */
  export type OrderDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
  }


  /**
   * Model Participant
   */

  export type AggregateParticipant = {
    _count: ParticipantCountAggregateOutputType | null
    _min: ParticipantMinAggregateOutputType | null
    _max: ParticipantMaxAggregateOutputType | null
  }

  export type ParticipantMinAggregateOutputType = {
    id: string | null
    orderId: string | null
    eventId: string | null
    fullNameKtp: string | null
    bibName: string | null
    phoneNumber: string | null
    nik: string | null
    gender: $Enums.Gender | null
    birthPlace: string | null
    birthDate: Date | null
    fullAddress: string | null
    country: string | null
    bloodType: $Enums.BloodType | null
    medicalHistory: string | null
    emergencyContactName: string | null
    emergencyContactPhone: string | null
    jerseyId: string | null
    selectedSize: string | null
    communityName: string | null
    bibNumber: string | null
    createdAt: Date | null
  }

  export type ParticipantMaxAggregateOutputType = {
    id: string | null
    orderId: string | null
    eventId: string | null
    fullNameKtp: string | null
    bibName: string | null
    phoneNumber: string | null
    nik: string | null
    gender: $Enums.Gender | null
    birthPlace: string | null
    birthDate: Date | null
    fullAddress: string | null
    country: string | null
    bloodType: $Enums.BloodType | null
    medicalHistory: string | null
    emergencyContactName: string | null
    emergencyContactPhone: string | null
    jerseyId: string | null
    selectedSize: string | null
    communityName: string | null
    bibNumber: string | null
    createdAt: Date | null
  }

  export type ParticipantCountAggregateOutputType = {
    id: number
    orderId: number
    eventId: number
    fullNameKtp: number
    bibName: number
    phoneNumber: number
    nik: number
    gender: number
    birthPlace: number
    birthDate: number
    fullAddress: number
    country: number
    bloodType: number
    medicalHistory: number
    emergencyContactName: number
    emergencyContactPhone: number
    jerseyId: number
    selectedSize: number
    communityName: number
    bibNumber: number
    createdAt: number
    _all: number
  }


  export type ParticipantMinAggregateInputType = {
    id?: true
    orderId?: true
    eventId?: true
    fullNameKtp?: true
    bibName?: true
    phoneNumber?: true
    nik?: true
    gender?: true
    birthPlace?: true
    birthDate?: true
    fullAddress?: true
    country?: true
    bloodType?: true
    medicalHistory?: true
    emergencyContactName?: true
    emergencyContactPhone?: true
    jerseyId?: true
    selectedSize?: true
    communityName?: true
    bibNumber?: true
    createdAt?: true
  }

  export type ParticipantMaxAggregateInputType = {
    id?: true
    orderId?: true
    eventId?: true
    fullNameKtp?: true
    bibName?: true
    phoneNumber?: true
    nik?: true
    gender?: true
    birthPlace?: true
    birthDate?: true
    fullAddress?: true
    country?: true
    bloodType?: true
    medicalHistory?: true
    emergencyContactName?: true
    emergencyContactPhone?: true
    jerseyId?: true
    selectedSize?: true
    communityName?: true
    bibNumber?: true
    createdAt?: true
  }

  export type ParticipantCountAggregateInputType = {
    id?: true
    orderId?: true
    eventId?: true
    fullNameKtp?: true
    bibName?: true
    phoneNumber?: true
    nik?: true
    gender?: true
    birthPlace?: true
    birthDate?: true
    fullAddress?: true
    country?: true
    bloodType?: true
    medicalHistory?: true
    emergencyContactName?: true
    emergencyContactPhone?: true
    jerseyId?: true
    selectedSize?: true
    communityName?: true
    bibNumber?: true
    createdAt?: true
    _all?: true
  }

  export type ParticipantAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Participant to aggregate.
     */
    where?: ParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Participants to fetch.
     */
    orderBy?: ParticipantOrderByWithRelationInput | ParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Participants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Participants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Participants
    **/
    _count?: true | ParticipantCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ParticipantMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ParticipantMaxAggregateInputType
  }

  export type GetParticipantAggregateType<T extends ParticipantAggregateArgs> = {
        [P in keyof T & keyof AggregateParticipant]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateParticipant[P]>
      : GetScalarType<T[P], AggregateParticipant[P]>
  }




  export type ParticipantGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ParticipantWhereInput
    orderBy?: ParticipantOrderByWithAggregationInput | ParticipantOrderByWithAggregationInput[]
    by: ParticipantScalarFieldEnum[] | ParticipantScalarFieldEnum
    having?: ParticipantScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ParticipantCountAggregateInputType | true
    _min?: ParticipantMinAggregateInputType
    _max?: ParticipantMaxAggregateInputType
  }

  export type ParticipantGroupByOutputType = {
    id: string
    orderId: string
    eventId: string
    fullNameKtp: string
    bibName: string
    phoneNumber: string | null
    nik: string
    gender: $Enums.Gender
    birthPlace: string
    birthDate: Date
    fullAddress: string
    country: string
    bloodType: $Enums.BloodType
    medicalHistory: string | null
    emergencyContactName: string
    emergencyContactPhone: string
    jerseyId: string | null
    selectedSize: string | null
    communityName: string | null
    bibNumber: string | null
    createdAt: Date
    _count: ParticipantCountAggregateOutputType | null
    _min: ParticipantMinAggregateOutputType | null
    _max: ParticipantMaxAggregateOutputType | null
  }

  type GetParticipantGroupByPayload<T extends ParticipantGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ParticipantGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ParticipantGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ParticipantGroupByOutputType[P]>
            : GetScalarType<T[P], ParticipantGroupByOutputType[P]>
        }
      >
    >


  export type ParticipantSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderId?: boolean
    eventId?: boolean
    fullNameKtp?: boolean
    bibName?: boolean
    phoneNumber?: boolean
    nik?: boolean
    gender?: boolean
    birthPlace?: boolean
    birthDate?: boolean
    fullAddress?: boolean
    country?: boolean
    bloodType?: boolean
    medicalHistory?: boolean
    emergencyContactName?: boolean
    emergencyContactPhone?: boolean
    jerseyId?: boolean
    selectedSize?: boolean
    communityName?: boolean
    bibNumber?: boolean
    createdAt?: boolean
    order?: boolean | OrderDefaultArgs<ExtArgs>
    event?: boolean | EventDefaultArgs<ExtArgs>
    jersey?: boolean | Participant$jerseyArgs<ExtArgs>
    qrToken?: boolean | Participant$qrTokenArgs<ExtArgs>
  }, ExtArgs["result"]["participant"]>

  export type ParticipantSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderId?: boolean
    eventId?: boolean
    fullNameKtp?: boolean
    bibName?: boolean
    phoneNumber?: boolean
    nik?: boolean
    gender?: boolean
    birthPlace?: boolean
    birthDate?: boolean
    fullAddress?: boolean
    country?: boolean
    bloodType?: boolean
    medicalHistory?: boolean
    emergencyContactName?: boolean
    emergencyContactPhone?: boolean
    jerseyId?: boolean
    selectedSize?: boolean
    communityName?: boolean
    bibNumber?: boolean
    createdAt?: boolean
    order?: boolean | OrderDefaultArgs<ExtArgs>
    event?: boolean | EventDefaultArgs<ExtArgs>
    jersey?: boolean | Participant$jerseyArgs<ExtArgs>
  }, ExtArgs["result"]["participant"]>

  export type ParticipantSelectScalar = {
    id?: boolean
    orderId?: boolean
    eventId?: boolean
    fullNameKtp?: boolean
    bibName?: boolean
    phoneNumber?: boolean
    nik?: boolean
    gender?: boolean
    birthPlace?: boolean
    birthDate?: boolean
    fullAddress?: boolean
    country?: boolean
    bloodType?: boolean
    medicalHistory?: boolean
    emergencyContactName?: boolean
    emergencyContactPhone?: boolean
    jerseyId?: boolean
    selectedSize?: boolean
    communityName?: boolean
    bibNumber?: boolean
    createdAt?: boolean
  }

  export type ParticipantInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    order?: boolean | OrderDefaultArgs<ExtArgs>
    event?: boolean | EventDefaultArgs<ExtArgs>
    jersey?: boolean | Participant$jerseyArgs<ExtArgs>
    qrToken?: boolean | Participant$qrTokenArgs<ExtArgs>
  }
  export type ParticipantIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    order?: boolean | OrderDefaultArgs<ExtArgs>
    event?: boolean | EventDefaultArgs<ExtArgs>
    jersey?: boolean | Participant$jerseyArgs<ExtArgs>
  }

  export type $ParticipantPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Participant"
    objects: {
      order: Prisma.$OrderPayload<ExtArgs>
      event: Prisma.$EventPayload<ExtArgs>
      jersey: Prisma.$JerseyPayload<ExtArgs> | null
      qrToken: Prisma.$QrTokenPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      orderId: string
      eventId: string
      fullNameKtp: string
      bibName: string
      phoneNumber: string | null
      nik: string
      gender: $Enums.Gender
      birthPlace: string
      birthDate: Date
      fullAddress: string
      country: string
      bloodType: $Enums.BloodType
      medicalHistory: string | null
      emergencyContactName: string
      emergencyContactPhone: string
      jerseyId: string | null
      selectedSize: string | null
      communityName: string | null
      bibNumber: string | null
      createdAt: Date
    }, ExtArgs["result"]["participant"]>
    composites: {}
  }

  type ParticipantGetPayload<S extends boolean | null | undefined | ParticipantDefaultArgs> = $Result.GetResult<Prisma.$ParticipantPayload, S>

  type ParticipantCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ParticipantFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ParticipantCountAggregateInputType | true
    }

  export interface ParticipantDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Participant'], meta: { name: 'Participant' } }
    /**
     * Find zero or one Participant that matches the filter.
     * @param {ParticipantFindUniqueArgs} args - Arguments to find a Participant
     * @example
     * // Get one Participant
     * const participant = await prisma.participant.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ParticipantFindUniqueArgs>(args: SelectSubset<T, ParticipantFindUniqueArgs<ExtArgs>>): Prisma__ParticipantClient<$Result.GetResult<Prisma.$ParticipantPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Participant that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ParticipantFindUniqueOrThrowArgs} args - Arguments to find a Participant
     * @example
     * // Get one Participant
     * const participant = await prisma.participant.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ParticipantFindUniqueOrThrowArgs>(args: SelectSubset<T, ParticipantFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ParticipantClient<$Result.GetResult<Prisma.$ParticipantPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Participant that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParticipantFindFirstArgs} args - Arguments to find a Participant
     * @example
     * // Get one Participant
     * const participant = await prisma.participant.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ParticipantFindFirstArgs>(args?: SelectSubset<T, ParticipantFindFirstArgs<ExtArgs>>): Prisma__ParticipantClient<$Result.GetResult<Prisma.$ParticipantPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Participant that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParticipantFindFirstOrThrowArgs} args - Arguments to find a Participant
     * @example
     * // Get one Participant
     * const participant = await prisma.participant.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ParticipantFindFirstOrThrowArgs>(args?: SelectSubset<T, ParticipantFindFirstOrThrowArgs<ExtArgs>>): Prisma__ParticipantClient<$Result.GetResult<Prisma.$ParticipantPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Participants that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParticipantFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Participants
     * const participants = await prisma.participant.findMany()
     * 
     * // Get first 10 Participants
     * const participants = await prisma.participant.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const participantWithIdOnly = await prisma.participant.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ParticipantFindManyArgs>(args?: SelectSubset<T, ParticipantFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ParticipantPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Participant.
     * @param {ParticipantCreateArgs} args - Arguments to create a Participant.
     * @example
     * // Create one Participant
     * const Participant = await prisma.participant.create({
     *   data: {
     *     // ... data to create a Participant
     *   }
     * })
     * 
     */
    create<T extends ParticipantCreateArgs>(args: SelectSubset<T, ParticipantCreateArgs<ExtArgs>>): Prisma__ParticipantClient<$Result.GetResult<Prisma.$ParticipantPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Participants.
     * @param {ParticipantCreateManyArgs} args - Arguments to create many Participants.
     * @example
     * // Create many Participants
     * const participant = await prisma.participant.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ParticipantCreateManyArgs>(args?: SelectSubset<T, ParticipantCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Participants and returns the data saved in the database.
     * @param {ParticipantCreateManyAndReturnArgs} args - Arguments to create many Participants.
     * @example
     * // Create many Participants
     * const participant = await prisma.participant.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Participants and only return the `id`
     * const participantWithIdOnly = await prisma.participant.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ParticipantCreateManyAndReturnArgs>(args?: SelectSubset<T, ParticipantCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ParticipantPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Participant.
     * @param {ParticipantDeleteArgs} args - Arguments to delete one Participant.
     * @example
     * // Delete one Participant
     * const Participant = await prisma.participant.delete({
     *   where: {
     *     // ... filter to delete one Participant
     *   }
     * })
     * 
     */
    delete<T extends ParticipantDeleteArgs>(args: SelectSubset<T, ParticipantDeleteArgs<ExtArgs>>): Prisma__ParticipantClient<$Result.GetResult<Prisma.$ParticipantPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Participant.
     * @param {ParticipantUpdateArgs} args - Arguments to update one Participant.
     * @example
     * // Update one Participant
     * const participant = await prisma.participant.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ParticipantUpdateArgs>(args: SelectSubset<T, ParticipantUpdateArgs<ExtArgs>>): Prisma__ParticipantClient<$Result.GetResult<Prisma.$ParticipantPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Participants.
     * @param {ParticipantDeleteManyArgs} args - Arguments to filter Participants to delete.
     * @example
     * // Delete a few Participants
     * const { count } = await prisma.participant.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ParticipantDeleteManyArgs>(args?: SelectSubset<T, ParticipantDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Participants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParticipantUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Participants
     * const participant = await prisma.participant.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ParticipantUpdateManyArgs>(args: SelectSubset<T, ParticipantUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Participant.
     * @param {ParticipantUpsertArgs} args - Arguments to update or create a Participant.
     * @example
     * // Update or create a Participant
     * const participant = await prisma.participant.upsert({
     *   create: {
     *     // ... data to create a Participant
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Participant we want to update
     *   }
     * })
     */
    upsert<T extends ParticipantUpsertArgs>(args: SelectSubset<T, ParticipantUpsertArgs<ExtArgs>>): Prisma__ParticipantClient<$Result.GetResult<Prisma.$ParticipantPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Participants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParticipantCountArgs} args - Arguments to filter Participants to count.
     * @example
     * // Count the number of Participants
     * const count = await prisma.participant.count({
     *   where: {
     *     // ... the filter for the Participants we want to count
     *   }
     * })
    **/
    count<T extends ParticipantCountArgs>(
      args?: Subset<T, ParticipantCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ParticipantCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Participant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParticipantAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ParticipantAggregateArgs>(args: Subset<T, ParticipantAggregateArgs>): Prisma.PrismaPromise<GetParticipantAggregateType<T>>

    /**
     * Group by Participant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParticipantGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ParticipantGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ParticipantGroupByArgs['orderBy'] }
        : { orderBy?: ParticipantGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ParticipantGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetParticipantGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Participant model
   */
  readonly fields: ParticipantFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Participant.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ParticipantClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    order<T extends OrderDefaultArgs<ExtArgs> = {}>(args?: Subset<T, OrderDefaultArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    event<T extends EventDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EventDefaultArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    jersey<T extends Participant$jerseyArgs<ExtArgs> = {}>(args?: Subset<T, Participant$jerseyArgs<ExtArgs>>): Prisma__JerseyClient<$Result.GetResult<Prisma.$JerseyPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    qrToken<T extends Participant$qrTokenArgs<ExtArgs> = {}>(args?: Subset<T, Participant$qrTokenArgs<ExtArgs>>): Prisma__QrTokenClient<$Result.GetResult<Prisma.$QrTokenPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Participant model
   */ 
  interface ParticipantFieldRefs {
    readonly id: FieldRef<"Participant", 'String'>
    readonly orderId: FieldRef<"Participant", 'String'>
    readonly eventId: FieldRef<"Participant", 'String'>
    readonly fullNameKtp: FieldRef<"Participant", 'String'>
    readonly bibName: FieldRef<"Participant", 'String'>
    readonly phoneNumber: FieldRef<"Participant", 'String'>
    readonly nik: FieldRef<"Participant", 'String'>
    readonly gender: FieldRef<"Participant", 'Gender'>
    readonly birthPlace: FieldRef<"Participant", 'String'>
    readonly birthDate: FieldRef<"Participant", 'DateTime'>
    readonly fullAddress: FieldRef<"Participant", 'String'>
    readonly country: FieldRef<"Participant", 'String'>
    readonly bloodType: FieldRef<"Participant", 'BloodType'>
    readonly medicalHistory: FieldRef<"Participant", 'String'>
    readonly emergencyContactName: FieldRef<"Participant", 'String'>
    readonly emergencyContactPhone: FieldRef<"Participant", 'String'>
    readonly jerseyId: FieldRef<"Participant", 'String'>
    readonly selectedSize: FieldRef<"Participant", 'String'>
    readonly communityName: FieldRef<"Participant", 'String'>
    readonly bibNumber: FieldRef<"Participant", 'String'>
    readonly createdAt: FieldRef<"Participant", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Participant findUnique
   */
  export type ParticipantFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participant
     */
    select?: ParticipantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantInclude<ExtArgs> | null
    /**
     * Filter, which Participant to fetch.
     */
    where: ParticipantWhereUniqueInput
  }

  /**
   * Participant findUniqueOrThrow
   */
  export type ParticipantFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participant
     */
    select?: ParticipantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantInclude<ExtArgs> | null
    /**
     * Filter, which Participant to fetch.
     */
    where: ParticipantWhereUniqueInput
  }

  /**
   * Participant findFirst
   */
  export type ParticipantFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participant
     */
    select?: ParticipantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantInclude<ExtArgs> | null
    /**
     * Filter, which Participant to fetch.
     */
    where?: ParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Participants to fetch.
     */
    orderBy?: ParticipantOrderByWithRelationInput | ParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Participants.
     */
    cursor?: ParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Participants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Participants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Participants.
     */
    distinct?: ParticipantScalarFieldEnum | ParticipantScalarFieldEnum[]
  }

  /**
   * Participant findFirstOrThrow
   */
  export type ParticipantFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participant
     */
    select?: ParticipantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantInclude<ExtArgs> | null
    /**
     * Filter, which Participant to fetch.
     */
    where?: ParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Participants to fetch.
     */
    orderBy?: ParticipantOrderByWithRelationInput | ParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Participants.
     */
    cursor?: ParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Participants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Participants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Participants.
     */
    distinct?: ParticipantScalarFieldEnum | ParticipantScalarFieldEnum[]
  }

  /**
   * Participant findMany
   */
  export type ParticipantFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participant
     */
    select?: ParticipantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantInclude<ExtArgs> | null
    /**
     * Filter, which Participants to fetch.
     */
    where?: ParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Participants to fetch.
     */
    orderBy?: ParticipantOrderByWithRelationInput | ParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Participants.
     */
    cursor?: ParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Participants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Participants.
     */
    skip?: number
    distinct?: ParticipantScalarFieldEnum | ParticipantScalarFieldEnum[]
  }

  /**
   * Participant create
   */
  export type ParticipantCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participant
     */
    select?: ParticipantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantInclude<ExtArgs> | null
    /**
     * The data needed to create a Participant.
     */
    data: XOR<ParticipantCreateInput, ParticipantUncheckedCreateInput>
  }

  /**
   * Participant createMany
   */
  export type ParticipantCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Participants.
     */
    data: ParticipantCreateManyInput | ParticipantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Participant createManyAndReturn
   */
  export type ParticipantCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participant
     */
    select?: ParticipantSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Participants.
     */
    data: ParticipantCreateManyInput | ParticipantCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Participant update
   */
  export type ParticipantUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participant
     */
    select?: ParticipantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantInclude<ExtArgs> | null
    /**
     * The data needed to update a Participant.
     */
    data: XOR<ParticipantUpdateInput, ParticipantUncheckedUpdateInput>
    /**
     * Choose, which Participant to update.
     */
    where: ParticipantWhereUniqueInput
  }

  /**
   * Participant updateMany
   */
  export type ParticipantUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Participants.
     */
    data: XOR<ParticipantUpdateManyMutationInput, ParticipantUncheckedUpdateManyInput>
    /**
     * Filter which Participants to update
     */
    where?: ParticipantWhereInput
  }

  /**
   * Participant upsert
   */
  export type ParticipantUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participant
     */
    select?: ParticipantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantInclude<ExtArgs> | null
    /**
     * The filter to search for the Participant to update in case it exists.
     */
    where: ParticipantWhereUniqueInput
    /**
     * In case the Participant found by the `where` argument doesn't exist, create a new Participant with this data.
     */
    create: XOR<ParticipantCreateInput, ParticipantUncheckedCreateInput>
    /**
     * In case the Participant was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ParticipantUpdateInput, ParticipantUncheckedUpdateInput>
  }

  /**
   * Participant delete
   */
  export type ParticipantDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participant
     */
    select?: ParticipantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantInclude<ExtArgs> | null
    /**
     * Filter which Participant to delete.
     */
    where: ParticipantWhereUniqueInput
  }

  /**
   * Participant deleteMany
   */
  export type ParticipantDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Participants to delete
     */
    where?: ParticipantWhereInput
  }

  /**
   * Participant.jersey
   */
  export type Participant$jerseyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Jersey
     */
    select?: JerseySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JerseyInclude<ExtArgs> | null
    where?: JerseyWhereInput
  }

  /**
   * Participant.qrToken
   */
  export type Participant$qrTokenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QrToken
     */
    select?: QrTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QrTokenInclude<ExtArgs> | null
    where?: QrTokenWhereInput
  }

  /**
   * Participant without action
   */
  export type ParticipantDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participant
     */
    select?: ParticipantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantInclude<ExtArgs> | null
  }


  /**
   * Model QrToken
   */

  export type AggregateQrToken = {
    _count: QrTokenCountAggregateOutputType | null
    _min: QrTokenMinAggregateOutputType | null
    _max: QrTokenMaxAggregateOutputType | null
  }

  export type QrTokenMinAggregateOutputType = {
    token: string | null
    participantId: string | null
    orderId: string | null
    createdAt: Date | null
  }

  export type QrTokenMaxAggregateOutputType = {
    token: string | null
    participantId: string | null
    orderId: string | null
    createdAt: Date | null
  }

  export type QrTokenCountAggregateOutputType = {
    token: number
    participantId: number
    orderId: number
    createdAt: number
    _all: number
  }


  export type QrTokenMinAggregateInputType = {
    token?: true
    participantId?: true
    orderId?: true
    createdAt?: true
  }

  export type QrTokenMaxAggregateInputType = {
    token?: true
    participantId?: true
    orderId?: true
    createdAt?: true
  }

  export type QrTokenCountAggregateInputType = {
    token?: true
    participantId?: true
    orderId?: true
    createdAt?: true
    _all?: true
  }

  export type QrTokenAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which QrToken to aggregate.
     */
    where?: QrTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QrTokens to fetch.
     */
    orderBy?: QrTokenOrderByWithRelationInput | QrTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: QrTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QrTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QrTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned QrTokens
    **/
    _count?: true | QrTokenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: QrTokenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: QrTokenMaxAggregateInputType
  }

  export type GetQrTokenAggregateType<T extends QrTokenAggregateArgs> = {
        [P in keyof T & keyof AggregateQrToken]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateQrToken[P]>
      : GetScalarType<T[P], AggregateQrToken[P]>
  }




  export type QrTokenGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QrTokenWhereInput
    orderBy?: QrTokenOrderByWithAggregationInput | QrTokenOrderByWithAggregationInput[]
    by: QrTokenScalarFieldEnum[] | QrTokenScalarFieldEnum
    having?: QrTokenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: QrTokenCountAggregateInputType | true
    _min?: QrTokenMinAggregateInputType
    _max?: QrTokenMaxAggregateInputType
  }

  export type QrTokenGroupByOutputType = {
    token: string
    participantId: string | null
    orderId: string | null
    createdAt: Date
    _count: QrTokenCountAggregateOutputType | null
    _min: QrTokenMinAggregateOutputType | null
    _max: QrTokenMaxAggregateOutputType | null
  }

  type GetQrTokenGroupByPayload<T extends QrTokenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<QrTokenGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof QrTokenGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], QrTokenGroupByOutputType[P]>
            : GetScalarType<T[P], QrTokenGroupByOutputType[P]>
        }
      >
    >


  export type QrTokenSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    token?: boolean
    participantId?: boolean
    orderId?: boolean
    createdAt?: boolean
    participant?: boolean | QrToken$participantArgs<ExtArgs>
    order?: boolean | QrToken$orderArgs<ExtArgs>
  }, ExtArgs["result"]["qrToken"]>

  export type QrTokenSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    token?: boolean
    participantId?: boolean
    orderId?: boolean
    createdAt?: boolean
    participant?: boolean | QrToken$participantArgs<ExtArgs>
    order?: boolean | QrToken$orderArgs<ExtArgs>
  }, ExtArgs["result"]["qrToken"]>

  export type QrTokenSelectScalar = {
    token?: boolean
    participantId?: boolean
    orderId?: boolean
    createdAt?: boolean
  }

  export type QrTokenInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    participant?: boolean | QrToken$participantArgs<ExtArgs>
    order?: boolean | QrToken$orderArgs<ExtArgs>
  }
  export type QrTokenIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    participant?: boolean | QrToken$participantArgs<ExtArgs>
    order?: boolean | QrToken$orderArgs<ExtArgs>
  }

  export type $QrTokenPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "QrToken"
    objects: {
      participant: Prisma.$ParticipantPayload<ExtArgs> | null
      order: Prisma.$OrderPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      token: string
      participantId: string | null
      orderId: string | null
      createdAt: Date
    }, ExtArgs["result"]["qrToken"]>
    composites: {}
  }

  type QrTokenGetPayload<S extends boolean | null | undefined | QrTokenDefaultArgs> = $Result.GetResult<Prisma.$QrTokenPayload, S>

  type QrTokenCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<QrTokenFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: QrTokenCountAggregateInputType | true
    }

  export interface QrTokenDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['QrToken'], meta: { name: 'QrToken' } }
    /**
     * Find zero or one QrToken that matches the filter.
     * @param {QrTokenFindUniqueArgs} args - Arguments to find a QrToken
     * @example
     * // Get one QrToken
     * const qrToken = await prisma.qrToken.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends QrTokenFindUniqueArgs>(args: SelectSubset<T, QrTokenFindUniqueArgs<ExtArgs>>): Prisma__QrTokenClient<$Result.GetResult<Prisma.$QrTokenPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one QrToken that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {QrTokenFindUniqueOrThrowArgs} args - Arguments to find a QrToken
     * @example
     * // Get one QrToken
     * const qrToken = await prisma.qrToken.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends QrTokenFindUniqueOrThrowArgs>(args: SelectSubset<T, QrTokenFindUniqueOrThrowArgs<ExtArgs>>): Prisma__QrTokenClient<$Result.GetResult<Prisma.$QrTokenPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first QrToken that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QrTokenFindFirstArgs} args - Arguments to find a QrToken
     * @example
     * // Get one QrToken
     * const qrToken = await prisma.qrToken.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends QrTokenFindFirstArgs>(args?: SelectSubset<T, QrTokenFindFirstArgs<ExtArgs>>): Prisma__QrTokenClient<$Result.GetResult<Prisma.$QrTokenPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first QrToken that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QrTokenFindFirstOrThrowArgs} args - Arguments to find a QrToken
     * @example
     * // Get one QrToken
     * const qrToken = await prisma.qrToken.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends QrTokenFindFirstOrThrowArgs>(args?: SelectSubset<T, QrTokenFindFirstOrThrowArgs<ExtArgs>>): Prisma__QrTokenClient<$Result.GetResult<Prisma.$QrTokenPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more QrTokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QrTokenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all QrTokens
     * const qrTokens = await prisma.qrToken.findMany()
     * 
     * // Get first 10 QrTokens
     * const qrTokens = await prisma.qrToken.findMany({ take: 10 })
     * 
     * // Only select the `token`
     * const qrTokenWithTokenOnly = await prisma.qrToken.findMany({ select: { token: true } })
     * 
     */
    findMany<T extends QrTokenFindManyArgs>(args?: SelectSubset<T, QrTokenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QrTokenPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a QrToken.
     * @param {QrTokenCreateArgs} args - Arguments to create a QrToken.
     * @example
     * // Create one QrToken
     * const QrToken = await prisma.qrToken.create({
     *   data: {
     *     // ... data to create a QrToken
     *   }
     * })
     * 
     */
    create<T extends QrTokenCreateArgs>(args: SelectSubset<T, QrTokenCreateArgs<ExtArgs>>): Prisma__QrTokenClient<$Result.GetResult<Prisma.$QrTokenPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many QrTokens.
     * @param {QrTokenCreateManyArgs} args - Arguments to create many QrTokens.
     * @example
     * // Create many QrTokens
     * const qrToken = await prisma.qrToken.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends QrTokenCreateManyArgs>(args?: SelectSubset<T, QrTokenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many QrTokens and returns the data saved in the database.
     * @param {QrTokenCreateManyAndReturnArgs} args - Arguments to create many QrTokens.
     * @example
     * // Create many QrTokens
     * const qrToken = await prisma.qrToken.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many QrTokens and only return the `token`
     * const qrTokenWithTokenOnly = await prisma.qrToken.createManyAndReturn({ 
     *   select: { token: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends QrTokenCreateManyAndReturnArgs>(args?: SelectSubset<T, QrTokenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QrTokenPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a QrToken.
     * @param {QrTokenDeleteArgs} args - Arguments to delete one QrToken.
     * @example
     * // Delete one QrToken
     * const QrToken = await prisma.qrToken.delete({
     *   where: {
     *     // ... filter to delete one QrToken
     *   }
     * })
     * 
     */
    delete<T extends QrTokenDeleteArgs>(args: SelectSubset<T, QrTokenDeleteArgs<ExtArgs>>): Prisma__QrTokenClient<$Result.GetResult<Prisma.$QrTokenPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one QrToken.
     * @param {QrTokenUpdateArgs} args - Arguments to update one QrToken.
     * @example
     * // Update one QrToken
     * const qrToken = await prisma.qrToken.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends QrTokenUpdateArgs>(args: SelectSubset<T, QrTokenUpdateArgs<ExtArgs>>): Prisma__QrTokenClient<$Result.GetResult<Prisma.$QrTokenPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more QrTokens.
     * @param {QrTokenDeleteManyArgs} args - Arguments to filter QrTokens to delete.
     * @example
     * // Delete a few QrTokens
     * const { count } = await prisma.qrToken.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends QrTokenDeleteManyArgs>(args?: SelectSubset<T, QrTokenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more QrTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QrTokenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many QrTokens
     * const qrToken = await prisma.qrToken.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends QrTokenUpdateManyArgs>(args: SelectSubset<T, QrTokenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one QrToken.
     * @param {QrTokenUpsertArgs} args - Arguments to update or create a QrToken.
     * @example
     * // Update or create a QrToken
     * const qrToken = await prisma.qrToken.upsert({
     *   create: {
     *     // ... data to create a QrToken
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the QrToken we want to update
     *   }
     * })
     */
    upsert<T extends QrTokenUpsertArgs>(args: SelectSubset<T, QrTokenUpsertArgs<ExtArgs>>): Prisma__QrTokenClient<$Result.GetResult<Prisma.$QrTokenPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of QrTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QrTokenCountArgs} args - Arguments to filter QrTokens to count.
     * @example
     * // Count the number of QrTokens
     * const count = await prisma.qrToken.count({
     *   where: {
     *     // ... the filter for the QrTokens we want to count
     *   }
     * })
    **/
    count<T extends QrTokenCountArgs>(
      args?: Subset<T, QrTokenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], QrTokenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a QrToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QrTokenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends QrTokenAggregateArgs>(args: Subset<T, QrTokenAggregateArgs>): Prisma.PrismaPromise<GetQrTokenAggregateType<T>>

    /**
     * Group by QrToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QrTokenGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends QrTokenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: QrTokenGroupByArgs['orderBy'] }
        : { orderBy?: QrTokenGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, QrTokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetQrTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the QrToken model
   */
  readonly fields: QrTokenFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for QrToken.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__QrTokenClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    participant<T extends QrToken$participantArgs<ExtArgs> = {}>(args?: Subset<T, QrToken$participantArgs<ExtArgs>>): Prisma__ParticipantClient<$Result.GetResult<Prisma.$ParticipantPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    order<T extends QrToken$orderArgs<ExtArgs> = {}>(args?: Subset<T, QrToken$orderArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the QrToken model
   */ 
  interface QrTokenFieldRefs {
    readonly token: FieldRef<"QrToken", 'String'>
    readonly participantId: FieldRef<"QrToken", 'String'>
    readonly orderId: FieldRef<"QrToken", 'String'>
    readonly createdAt: FieldRef<"QrToken", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * QrToken findUnique
   */
  export type QrTokenFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QrToken
     */
    select?: QrTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QrTokenInclude<ExtArgs> | null
    /**
     * Filter, which QrToken to fetch.
     */
    where: QrTokenWhereUniqueInput
  }

  /**
   * QrToken findUniqueOrThrow
   */
  export type QrTokenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QrToken
     */
    select?: QrTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QrTokenInclude<ExtArgs> | null
    /**
     * Filter, which QrToken to fetch.
     */
    where: QrTokenWhereUniqueInput
  }

  /**
   * QrToken findFirst
   */
  export type QrTokenFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QrToken
     */
    select?: QrTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QrTokenInclude<ExtArgs> | null
    /**
     * Filter, which QrToken to fetch.
     */
    where?: QrTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QrTokens to fetch.
     */
    orderBy?: QrTokenOrderByWithRelationInput | QrTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for QrTokens.
     */
    cursor?: QrTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QrTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QrTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QrTokens.
     */
    distinct?: QrTokenScalarFieldEnum | QrTokenScalarFieldEnum[]
  }

  /**
   * QrToken findFirstOrThrow
   */
  export type QrTokenFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QrToken
     */
    select?: QrTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QrTokenInclude<ExtArgs> | null
    /**
     * Filter, which QrToken to fetch.
     */
    where?: QrTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QrTokens to fetch.
     */
    orderBy?: QrTokenOrderByWithRelationInput | QrTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for QrTokens.
     */
    cursor?: QrTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QrTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QrTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QrTokens.
     */
    distinct?: QrTokenScalarFieldEnum | QrTokenScalarFieldEnum[]
  }

  /**
   * QrToken findMany
   */
  export type QrTokenFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QrToken
     */
    select?: QrTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QrTokenInclude<ExtArgs> | null
    /**
     * Filter, which QrTokens to fetch.
     */
    where?: QrTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QrTokens to fetch.
     */
    orderBy?: QrTokenOrderByWithRelationInput | QrTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing QrTokens.
     */
    cursor?: QrTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QrTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QrTokens.
     */
    skip?: number
    distinct?: QrTokenScalarFieldEnum | QrTokenScalarFieldEnum[]
  }

  /**
   * QrToken create
   */
  export type QrTokenCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QrToken
     */
    select?: QrTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QrTokenInclude<ExtArgs> | null
    /**
     * The data needed to create a QrToken.
     */
    data: XOR<QrTokenCreateInput, QrTokenUncheckedCreateInput>
  }

  /**
   * QrToken createMany
   */
  export type QrTokenCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many QrTokens.
     */
    data: QrTokenCreateManyInput | QrTokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * QrToken createManyAndReturn
   */
  export type QrTokenCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QrToken
     */
    select?: QrTokenSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many QrTokens.
     */
    data: QrTokenCreateManyInput | QrTokenCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QrTokenIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * QrToken update
   */
  export type QrTokenUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QrToken
     */
    select?: QrTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QrTokenInclude<ExtArgs> | null
    /**
     * The data needed to update a QrToken.
     */
    data: XOR<QrTokenUpdateInput, QrTokenUncheckedUpdateInput>
    /**
     * Choose, which QrToken to update.
     */
    where: QrTokenWhereUniqueInput
  }

  /**
   * QrToken updateMany
   */
  export type QrTokenUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update QrTokens.
     */
    data: XOR<QrTokenUpdateManyMutationInput, QrTokenUncheckedUpdateManyInput>
    /**
     * Filter which QrTokens to update
     */
    where?: QrTokenWhereInput
  }

  /**
   * QrToken upsert
   */
  export type QrTokenUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QrToken
     */
    select?: QrTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QrTokenInclude<ExtArgs> | null
    /**
     * The filter to search for the QrToken to update in case it exists.
     */
    where: QrTokenWhereUniqueInput
    /**
     * In case the QrToken found by the `where` argument doesn't exist, create a new QrToken with this data.
     */
    create: XOR<QrTokenCreateInput, QrTokenUncheckedCreateInput>
    /**
     * In case the QrToken was found with the provided `where` argument, update it with this data.
     */
    update: XOR<QrTokenUpdateInput, QrTokenUncheckedUpdateInput>
  }

  /**
   * QrToken delete
   */
  export type QrTokenDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QrToken
     */
    select?: QrTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QrTokenInclude<ExtArgs> | null
    /**
     * Filter which QrToken to delete.
     */
    where: QrTokenWhereUniqueInput
  }

  /**
   * QrToken deleteMany
   */
  export type QrTokenDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which QrTokens to delete
     */
    where?: QrTokenWhereInput
  }

  /**
   * QrToken.participant
   */
  export type QrToken$participantArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participant
     */
    select?: ParticipantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantInclude<ExtArgs> | null
    where?: ParticipantWhereInput
  }

  /**
   * QrToken.order
   */
  export type QrToken$orderArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    where?: OrderWhereInput
  }

  /**
   * QrToken without action
   */
  export type QrTokenDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QrToken
     */
    select?: QrTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QrTokenInclude<ExtArgs> | null
  }


  /**
   * Model Log
   */

  export type AggregateLog = {
    _count: LogCountAggregateOutputType | null
    _min: LogMinAggregateOutputType | null
    _max: LogMaxAggregateOutputType | null
  }

  export type LogMinAggregateOutputType = {
    id: string | null
    action: string | null
    description: string | null
    userId: string | null
    adminId: string | null
    entityType: string | null
    entityId: string | null
    createdAt: Date | null
  }

  export type LogMaxAggregateOutputType = {
    id: string | null
    action: string | null
    description: string | null
    userId: string | null
    adminId: string | null
    entityType: string | null
    entityId: string | null
    createdAt: Date | null
  }

  export type LogCountAggregateOutputType = {
    id: number
    action: number
    description: number
    userId: number
    adminId: number
    entityType: number
    entityId: number
    metadata: number
    createdAt: number
    _all: number
  }


  export type LogMinAggregateInputType = {
    id?: true
    action?: true
    description?: true
    userId?: true
    adminId?: true
    entityType?: true
    entityId?: true
    createdAt?: true
  }

  export type LogMaxAggregateInputType = {
    id?: true
    action?: true
    description?: true
    userId?: true
    adminId?: true
    entityType?: true
    entityId?: true
    createdAt?: true
  }

  export type LogCountAggregateInputType = {
    id?: true
    action?: true
    description?: true
    userId?: true
    adminId?: true
    entityType?: true
    entityId?: true
    metadata?: true
    createdAt?: true
    _all?: true
  }

  export type LogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Log to aggregate.
     */
    where?: LogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Logs to fetch.
     */
    orderBy?: LogOrderByWithRelationInput | LogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Logs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Logs
    **/
    _count?: true | LogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LogMaxAggregateInputType
  }

  export type GetLogAggregateType<T extends LogAggregateArgs> = {
        [P in keyof T & keyof AggregateLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLog[P]>
      : GetScalarType<T[P], AggregateLog[P]>
  }




  export type LogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LogWhereInput
    orderBy?: LogOrderByWithAggregationInput | LogOrderByWithAggregationInput[]
    by: LogScalarFieldEnum[] | LogScalarFieldEnum
    having?: LogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LogCountAggregateInputType | true
    _min?: LogMinAggregateInputType
    _max?: LogMaxAggregateInputType
  }

  export type LogGroupByOutputType = {
    id: string
    action: string
    description: string
    userId: string | null
    adminId: string | null
    entityType: string | null
    entityId: string | null
    metadata: JsonValue | null
    createdAt: Date
    _count: LogCountAggregateOutputType | null
    _min: LogMinAggregateOutputType | null
    _max: LogMaxAggregateOutputType | null
  }

  type GetLogGroupByPayload<T extends LogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LogGroupByOutputType[P]>
            : GetScalarType<T[P], LogGroupByOutputType[P]>
        }
      >
    >


  export type LogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    action?: boolean
    description?: boolean
    userId?: boolean
    adminId?: boolean
    entityType?: boolean
    entityId?: boolean
    metadata?: boolean
    createdAt?: boolean
    user?: boolean | Log$userArgs<ExtArgs>
    admin?: boolean | Log$adminArgs<ExtArgs>
  }, ExtArgs["result"]["log"]>

  export type LogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    action?: boolean
    description?: boolean
    userId?: boolean
    adminId?: boolean
    entityType?: boolean
    entityId?: boolean
    metadata?: boolean
    createdAt?: boolean
    user?: boolean | Log$userArgs<ExtArgs>
    admin?: boolean | Log$adminArgs<ExtArgs>
  }, ExtArgs["result"]["log"]>

  export type LogSelectScalar = {
    id?: boolean
    action?: boolean
    description?: boolean
    userId?: boolean
    adminId?: boolean
    entityType?: boolean
    entityId?: boolean
    metadata?: boolean
    createdAt?: boolean
  }

  export type LogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Log$userArgs<ExtArgs>
    admin?: boolean | Log$adminArgs<ExtArgs>
  }
  export type LogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Log$userArgs<ExtArgs>
    admin?: boolean | Log$adminArgs<ExtArgs>
  }

  export type $LogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Log"
    objects: {
      user: Prisma.$UserPayload<ExtArgs> | null
      admin: Prisma.$AdminPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      action: string
      description: string
      userId: string | null
      adminId: string | null
      entityType: string | null
      entityId: string | null
      metadata: Prisma.JsonValue | null
      createdAt: Date
    }, ExtArgs["result"]["log"]>
    composites: {}
  }

  type LogGetPayload<S extends boolean | null | undefined | LogDefaultArgs> = $Result.GetResult<Prisma.$LogPayload, S>

  type LogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<LogFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: LogCountAggregateInputType | true
    }

  export interface LogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Log'], meta: { name: 'Log' } }
    /**
     * Find zero or one Log that matches the filter.
     * @param {LogFindUniqueArgs} args - Arguments to find a Log
     * @example
     * // Get one Log
     * const log = await prisma.log.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LogFindUniqueArgs>(args: SelectSubset<T, LogFindUniqueArgs<ExtArgs>>): Prisma__LogClient<$Result.GetResult<Prisma.$LogPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Log that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {LogFindUniqueOrThrowArgs} args - Arguments to find a Log
     * @example
     * // Get one Log
     * const log = await prisma.log.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LogFindUniqueOrThrowArgs>(args: SelectSubset<T, LogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LogClient<$Result.GetResult<Prisma.$LogPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Log that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LogFindFirstArgs} args - Arguments to find a Log
     * @example
     * // Get one Log
     * const log = await prisma.log.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LogFindFirstArgs>(args?: SelectSubset<T, LogFindFirstArgs<ExtArgs>>): Prisma__LogClient<$Result.GetResult<Prisma.$LogPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Log that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LogFindFirstOrThrowArgs} args - Arguments to find a Log
     * @example
     * // Get one Log
     * const log = await prisma.log.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LogFindFirstOrThrowArgs>(args?: SelectSubset<T, LogFindFirstOrThrowArgs<ExtArgs>>): Prisma__LogClient<$Result.GetResult<Prisma.$LogPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Logs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Logs
     * const logs = await prisma.log.findMany()
     * 
     * // Get first 10 Logs
     * const logs = await prisma.log.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const logWithIdOnly = await prisma.log.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LogFindManyArgs>(args?: SelectSubset<T, LogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LogPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Log.
     * @param {LogCreateArgs} args - Arguments to create a Log.
     * @example
     * // Create one Log
     * const Log = await prisma.log.create({
     *   data: {
     *     // ... data to create a Log
     *   }
     * })
     * 
     */
    create<T extends LogCreateArgs>(args: SelectSubset<T, LogCreateArgs<ExtArgs>>): Prisma__LogClient<$Result.GetResult<Prisma.$LogPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Logs.
     * @param {LogCreateManyArgs} args - Arguments to create many Logs.
     * @example
     * // Create many Logs
     * const log = await prisma.log.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LogCreateManyArgs>(args?: SelectSubset<T, LogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Logs and returns the data saved in the database.
     * @param {LogCreateManyAndReturnArgs} args - Arguments to create many Logs.
     * @example
     * // Create many Logs
     * const log = await prisma.log.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Logs and only return the `id`
     * const logWithIdOnly = await prisma.log.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LogCreateManyAndReturnArgs>(args?: SelectSubset<T, LogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LogPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Log.
     * @param {LogDeleteArgs} args - Arguments to delete one Log.
     * @example
     * // Delete one Log
     * const Log = await prisma.log.delete({
     *   where: {
     *     // ... filter to delete one Log
     *   }
     * })
     * 
     */
    delete<T extends LogDeleteArgs>(args: SelectSubset<T, LogDeleteArgs<ExtArgs>>): Prisma__LogClient<$Result.GetResult<Prisma.$LogPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Log.
     * @param {LogUpdateArgs} args - Arguments to update one Log.
     * @example
     * // Update one Log
     * const log = await prisma.log.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LogUpdateArgs>(args: SelectSubset<T, LogUpdateArgs<ExtArgs>>): Prisma__LogClient<$Result.GetResult<Prisma.$LogPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Logs.
     * @param {LogDeleteManyArgs} args - Arguments to filter Logs to delete.
     * @example
     * // Delete a few Logs
     * const { count } = await prisma.log.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LogDeleteManyArgs>(args?: SelectSubset<T, LogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Logs
     * const log = await prisma.log.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LogUpdateManyArgs>(args: SelectSubset<T, LogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Log.
     * @param {LogUpsertArgs} args - Arguments to update or create a Log.
     * @example
     * // Update or create a Log
     * const log = await prisma.log.upsert({
     *   create: {
     *     // ... data to create a Log
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Log we want to update
     *   }
     * })
     */
    upsert<T extends LogUpsertArgs>(args: SelectSubset<T, LogUpsertArgs<ExtArgs>>): Prisma__LogClient<$Result.GetResult<Prisma.$LogPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LogCountArgs} args - Arguments to filter Logs to count.
     * @example
     * // Count the number of Logs
     * const count = await prisma.log.count({
     *   where: {
     *     // ... the filter for the Logs we want to count
     *   }
     * })
    **/
    count<T extends LogCountArgs>(
      args?: Subset<T, LogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Log.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LogAggregateArgs>(args: Subset<T, LogAggregateArgs>): Prisma.PrismaPromise<GetLogAggregateType<T>>

    /**
     * Group by Log.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LogGroupByArgs['orderBy'] }
        : { orderBy?: LogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Log model
   */
  readonly fields: LogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Log.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends Log$userArgs<ExtArgs> = {}>(args?: Subset<T, Log$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    admin<T extends Log$adminArgs<ExtArgs> = {}>(args?: Subset<T, Log$adminArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Log model
   */ 
  interface LogFieldRefs {
    readonly id: FieldRef<"Log", 'String'>
    readonly action: FieldRef<"Log", 'String'>
    readonly description: FieldRef<"Log", 'String'>
    readonly userId: FieldRef<"Log", 'String'>
    readonly adminId: FieldRef<"Log", 'String'>
    readonly entityType: FieldRef<"Log", 'String'>
    readonly entityId: FieldRef<"Log", 'String'>
    readonly metadata: FieldRef<"Log", 'Json'>
    readonly createdAt: FieldRef<"Log", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Log findUnique
   */
  export type LogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Log
     */
    select?: LogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LogInclude<ExtArgs> | null
    /**
     * Filter, which Log to fetch.
     */
    where: LogWhereUniqueInput
  }

  /**
   * Log findUniqueOrThrow
   */
  export type LogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Log
     */
    select?: LogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LogInclude<ExtArgs> | null
    /**
     * Filter, which Log to fetch.
     */
    where: LogWhereUniqueInput
  }

  /**
   * Log findFirst
   */
  export type LogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Log
     */
    select?: LogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LogInclude<ExtArgs> | null
    /**
     * Filter, which Log to fetch.
     */
    where?: LogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Logs to fetch.
     */
    orderBy?: LogOrderByWithRelationInput | LogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Logs.
     */
    cursor?: LogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Logs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Logs.
     */
    distinct?: LogScalarFieldEnum | LogScalarFieldEnum[]
  }

  /**
   * Log findFirstOrThrow
   */
  export type LogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Log
     */
    select?: LogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LogInclude<ExtArgs> | null
    /**
     * Filter, which Log to fetch.
     */
    where?: LogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Logs to fetch.
     */
    orderBy?: LogOrderByWithRelationInput | LogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Logs.
     */
    cursor?: LogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Logs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Logs.
     */
    distinct?: LogScalarFieldEnum | LogScalarFieldEnum[]
  }

  /**
   * Log findMany
   */
  export type LogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Log
     */
    select?: LogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LogInclude<ExtArgs> | null
    /**
     * Filter, which Logs to fetch.
     */
    where?: LogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Logs to fetch.
     */
    orderBy?: LogOrderByWithRelationInput | LogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Logs.
     */
    cursor?: LogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Logs.
     */
    skip?: number
    distinct?: LogScalarFieldEnum | LogScalarFieldEnum[]
  }

  /**
   * Log create
   */
  export type LogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Log
     */
    select?: LogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LogInclude<ExtArgs> | null
    /**
     * The data needed to create a Log.
     */
    data: XOR<LogCreateInput, LogUncheckedCreateInput>
  }

  /**
   * Log createMany
   */
  export type LogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Logs.
     */
    data: LogCreateManyInput | LogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Log createManyAndReturn
   */
  export type LogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Log
     */
    select?: LogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Logs.
     */
    data: LogCreateManyInput | LogCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Log update
   */
  export type LogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Log
     */
    select?: LogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LogInclude<ExtArgs> | null
    /**
     * The data needed to update a Log.
     */
    data: XOR<LogUpdateInput, LogUncheckedUpdateInput>
    /**
     * Choose, which Log to update.
     */
    where: LogWhereUniqueInput
  }

  /**
   * Log updateMany
   */
  export type LogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Logs.
     */
    data: XOR<LogUpdateManyMutationInput, LogUncheckedUpdateManyInput>
    /**
     * Filter which Logs to update
     */
    where?: LogWhereInput
  }

  /**
   * Log upsert
   */
  export type LogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Log
     */
    select?: LogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LogInclude<ExtArgs> | null
    /**
     * The filter to search for the Log to update in case it exists.
     */
    where: LogWhereUniqueInput
    /**
     * In case the Log found by the `where` argument doesn't exist, create a new Log with this data.
     */
    create: XOR<LogCreateInput, LogUncheckedCreateInput>
    /**
     * In case the Log was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LogUpdateInput, LogUncheckedUpdateInput>
  }

  /**
   * Log delete
   */
  export type LogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Log
     */
    select?: LogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LogInclude<ExtArgs> | null
    /**
     * Filter which Log to delete.
     */
    where: LogWhereUniqueInput
  }

  /**
   * Log deleteMany
   */
  export type LogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Logs to delete
     */
    where?: LogWhereInput
  }

  /**
   * Log.user
   */
  export type Log$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Log.admin
   */
  export type Log$adminArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminInclude<ExtArgs> | null
    where?: AdminWhereInput
  }

  /**
   * Log without action
   */
  export type LogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Log
     */
    select?: LogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LogInclude<ExtArgs> | null
  }


  /**
   * Model BibConfiguration
   */

  export type AggregateBibConfiguration = {
    _count: BibConfigurationCountAggregateOutputType | null
    _avg: BibConfigurationAvgAggregateOutputType | null
    _sum: BibConfigurationSumAggregateOutputType | null
    _min: BibConfigurationMinAggregateOutputType | null
    _max: BibConfigurationMaxAggregateOutputType | null
  }

  export type BibConfigurationAvgAggregateOutputType = {
    digitLength: number | null
    startNumber: number | null
  }

  export type BibConfigurationSumAggregateOutputType = {
    digitLength: number | null
    startNumber: number | null
  }

  export type BibConfigurationMinAggregateOutputType = {
    id: string | null
    eventId: string | null
    prefix: string | null
    digitLength: number | null
    startNumber: number | null
    suffix: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BibConfigurationMaxAggregateOutputType = {
    id: string | null
    eventId: string | null
    prefix: string | null
    digitLength: number | null
    startNumber: number | null
    suffix: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BibConfigurationCountAggregateOutputType = {
    id: number
    eventId: number
    prefix: number
    digitLength: number
    startNumber: number
    suffix: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type BibConfigurationAvgAggregateInputType = {
    digitLength?: true
    startNumber?: true
  }

  export type BibConfigurationSumAggregateInputType = {
    digitLength?: true
    startNumber?: true
  }

  export type BibConfigurationMinAggregateInputType = {
    id?: true
    eventId?: true
    prefix?: true
    digitLength?: true
    startNumber?: true
    suffix?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BibConfigurationMaxAggregateInputType = {
    id?: true
    eventId?: true
    prefix?: true
    digitLength?: true
    startNumber?: true
    suffix?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BibConfigurationCountAggregateInputType = {
    id?: true
    eventId?: true
    prefix?: true
    digitLength?: true
    startNumber?: true
    suffix?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type BibConfigurationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BibConfiguration to aggregate.
     */
    where?: BibConfigurationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BibConfigurations to fetch.
     */
    orderBy?: BibConfigurationOrderByWithRelationInput | BibConfigurationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BibConfigurationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BibConfigurations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BibConfigurations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BibConfigurations
    **/
    _count?: true | BibConfigurationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BibConfigurationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BibConfigurationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BibConfigurationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BibConfigurationMaxAggregateInputType
  }

  export type GetBibConfigurationAggregateType<T extends BibConfigurationAggregateArgs> = {
        [P in keyof T & keyof AggregateBibConfiguration]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBibConfiguration[P]>
      : GetScalarType<T[P], AggregateBibConfiguration[P]>
  }




  export type BibConfigurationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BibConfigurationWhereInput
    orderBy?: BibConfigurationOrderByWithAggregationInput | BibConfigurationOrderByWithAggregationInput[]
    by: BibConfigurationScalarFieldEnum[] | BibConfigurationScalarFieldEnum
    having?: BibConfigurationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BibConfigurationCountAggregateInputType | true
    _avg?: BibConfigurationAvgAggregateInputType
    _sum?: BibConfigurationSumAggregateInputType
    _min?: BibConfigurationMinAggregateInputType
    _max?: BibConfigurationMaxAggregateInputType
  }

  export type BibConfigurationGroupByOutputType = {
    id: string
    eventId: string
    prefix: string
    digitLength: number
    startNumber: number
    suffix: string | null
    createdAt: Date
    updatedAt: Date
    _count: BibConfigurationCountAggregateOutputType | null
    _avg: BibConfigurationAvgAggregateOutputType | null
    _sum: BibConfigurationSumAggregateOutputType | null
    _min: BibConfigurationMinAggregateOutputType | null
    _max: BibConfigurationMaxAggregateOutputType | null
  }

  type GetBibConfigurationGroupByPayload<T extends BibConfigurationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BibConfigurationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BibConfigurationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BibConfigurationGroupByOutputType[P]>
            : GetScalarType<T[P], BibConfigurationGroupByOutputType[P]>
        }
      >
    >


  export type BibConfigurationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    eventId?: boolean
    prefix?: boolean
    digitLength?: boolean
    startNumber?: boolean
    suffix?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    event?: boolean | EventDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bibConfiguration"]>

  export type BibConfigurationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    eventId?: boolean
    prefix?: boolean
    digitLength?: boolean
    startNumber?: boolean
    suffix?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    event?: boolean | EventDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bibConfiguration"]>

  export type BibConfigurationSelectScalar = {
    id?: boolean
    eventId?: boolean
    prefix?: boolean
    digitLength?: boolean
    startNumber?: boolean
    suffix?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type BibConfigurationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    event?: boolean | EventDefaultArgs<ExtArgs>
  }
  export type BibConfigurationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    event?: boolean | EventDefaultArgs<ExtArgs>
  }

  export type $BibConfigurationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BibConfiguration"
    objects: {
      event: Prisma.$EventPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      eventId: string
      prefix: string
      digitLength: number
      startNumber: number
      suffix: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["bibConfiguration"]>
    composites: {}
  }

  type BibConfigurationGetPayload<S extends boolean | null | undefined | BibConfigurationDefaultArgs> = $Result.GetResult<Prisma.$BibConfigurationPayload, S>

  type BibConfigurationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<BibConfigurationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: BibConfigurationCountAggregateInputType | true
    }

  export interface BibConfigurationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BibConfiguration'], meta: { name: 'BibConfiguration' } }
    /**
     * Find zero or one BibConfiguration that matches the filter.
     * @param {BibConfigurationFindUniqueArgs} args - Arguments to find a BibConfiguration
     * @example
     * // Get one BibConfiguration
     * const bibConfiguration = await prisma.bibConfiguration.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BibConfigurationFindUniqueArgs>(args: SelectSubset<T, BibConfigurationFindUniqueArgs<ExtArgs>>): Prisma__BibConfigurationClient<$Result.GetResult<Prisma.$BibConfigurationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one BibConfiguration that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {BibConfigurationFindUniqueOrThrowArgs} args - Arguments to find a BibConfiguration
     * @example
     * // Get one BibConfiguration
     * const bibConfiguration = await prisma.bibConfiguration.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BibConfigurationFindUniqueOrThrowArgs>(args: SelectSubset<T, BibConfigurationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BibConfigurationClient<$Result.GetResult<Prisma.$BibConfigurationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first BibConfiguration that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BibConfigurationFindFirstArgs} args - Arguments to find a BibConfiguration
     * @example
     * // Get one BibConfiguration
     * const bibConfiguration = await prisma.bibConfiguration.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BibConfigurationFindFirstArgs>(args?: SelectSubset<T, BibConfigurationFindFirstArgs<ExtArgs>>): Prisma__BibConfigurationClient<$Result.GetResult<Prisma.$BibConfigurationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first BibConfiguration that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BibConfigurationFindFirstOrThrowArgs} args - Arguments to find a BibConfiguration
     * @example
     * // Get one BibConfiguration
     * const bibConfiguration = await prisma.bibConfiguration.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BibConfigurationFindFirstOrThrowArgs>(args?: SelectSubset<T, BibConfigurationFindFirstOrThrowArgs<ExtArgs>>): Prisma__BibConfigurationClient<$Result.GetResult<Prisma.$BibConfigurationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more BibConfigurations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BibConfigurationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BibConfigurations
     * const bibConfigurations = await prisma.bibConfiguration.findMany()
     * 
     * // Get first 10 BibConfigurations
     * const bibConfigurations = await prisma.bibConfiguration.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const bibConfigurationWithIdOnly = await prisma.bibConfiguration.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BibConfigurationFindManyArgs>(args?: SelectSubset<T, BibConfigurationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BibConfigurationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a BibConfiguration.
     * @param {BibConfigurationCreateArgs} args - Arguments to create a BibConfiguration.
     * @example
     * // Create one BibConfiguration
     * const BibConfiguration = await prisma.bibConfiguration.create({
     *   data: {
     *     // ... data to create a BibConfiguration
     *   }
     * })
     * 
     */
    create<T extends BibConfigurationCreateArgs>(args: SelectSubset<T, BibConfigurationCreateArgs<ExtArgs>>): Prisma__BibConfigurationClient<$Result.GetResult<Prisma.$BibConfigurationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many BibConfigurations.
     * @param {BibConfigurationCreateManyArgs} args - Arguments to create many BibConfigurations.
     * @example
     * // Create many BibConfigurations
     * const bibConfiguration = await prisma.bibConfiguration.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BibConfigurationCreateManyArgs>(args?: SelectSubset<T, BibConfigurationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BibConfigurations and returns the data saved in the database.
     * @param {BibConfigurationCreateManyAndReturnArgs} args - Arguments to create many BibConfigurations.
     * @example
     * // Create many BibConfigurations
     * const bibConfiguration = await prisma.bibConfiguration.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BibConfigurations and only return the `id`
     * const bibConfigurationWithIdOnly = await prisma.bibConfiguration.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BibConfigurationCreateManyAndReturnArgs>(args?: SelectSubset<T, BibConfigurationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BibConfigurationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a BibConfiguration.
     * @param {BibConfigurationDeleteArgs} args - Arguments to delete one BibConfiguration.
     * @example
     * // Delete one BibConfiguration
     * const BibConfiguration = await prisma.bibConfiguration.delete({
     *   where: {
     *     // ... filter to delete one BibConfiguration
     *   }
     * })
     * 
     */
    delete<T extends BibConfigurationDeleteArgs>(args: SelectSubset<T, BibConfigurationDeleteArgs<ExtArgs>>): Prisma__BibConfigurationClient<$Result.GetResult<Prisma.$BibConfigurationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one BibConfiguration.
     * @param {BibConfigurationUpdateArgs} args - Arguments to update one BibConfiguration.
     * @example
     * // Update one BibConfiguration
     * const bibConfiguration = await prisma.bibConfiguration.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BibConfigurationUpdateArgs>(args: SelectSubset<T, BibConfigurationUpdateArgs<ExtArgs>>): Prisma__BibConfigurationClient<$Result.GetResult<Prisma.$BibConfigurationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more BibConfigurations.
     * @param {BibConfigurationDeleteManyArgs} args - Arguments to filter BibConfigurations to delete.
     * @example
     * // Delete a few BibConfigurations
     * const { count } = await prisma.bibConfiguration.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BibConfigurationDeleteManyArgs>(args?: SelectSubset<T, BibConfigurationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BibConfigurations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BibConfigurationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BibConfigurations
     * const bibConfiguration = await prisma.bibConfiguration.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BibConfigurationUpdateManyArgs>(args: SelectSubset<T, BibConfigurationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one BibConfiguration.
     * @param {BibConfigurationUpsertArgs} args - Arguments to update or create a BibConfiguration.
     * @example
     * // Update or create a BibConfiguration
     * const bibConfiguration = await prisma.bibConfiguration.upsert({
     *   create: {
     *     // ... data to create a BibConfiguration
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BibConfiguration we want to update
     *   }
     * })
     */
    upsert<T extends BibConfigurationUpsertArgs>(args: SelectSubset<T, BibConfigurationUpsertArgs<ExtArgs>>): Prisma__BibConfigurationClient<$Result.GetResult<Prisma.$BibConfigurationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of BibConfigurations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BibConfigurationCountArgs} args - Arguments to filter BibConfigurations to count.
     * @example
     * // Count the number of BibConfigurations
     * const count = await prisma.bibConfiguration.count({
     *   where: {
     *     // ... the filter for the BibConfigurations we want to count
     *   }
     * })
    **/
    count<T extends BibConfigurationCountArgs>(
      args?: Subset<T, BibConfigurationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BibConfigurationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BibConfiguration.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BibConfigurationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BibConfigurationAggregateArgs>(args: Subset<T, BibConfigurationAggregateArgs>): Prisma.PrismaPromise<GetBibConfigurationAggregateType<T>>

    /**
     * Group by BibConfiguration.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BibConfigurationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BibConfigurationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BibConfigurationGroupByArgs['orderBy'] }
        : { orderBy?: BibConfigurationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BibConfigurationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBibConfigurationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BibConfiguration model
   */
  readonly fields: BibConfigurationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BibConfiguration.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BibConfigurationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    event<T extends EventDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EventDefaultArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the BibConfiguration model
   */ 
  interface BibConfigurationFieldRefs {
    readonly id: FieldRef<"BibConfiguration", 'String'>
    readonly eventId: FieldRef<"BibConfiguration", 'String'>
    readonly prefix: FieldRef<"BibConfiguration", 'String'>
    readonly digitLength: FieldRef<"BibConfiguration", 'Int'>
    readonly startNumber: FieldRef<"BibConfiguration", 'Int'>
    readonly suffix: FieldRef<"BibConfiguration", 'String'>
    readonly createdAt: FieldRef<"BibConfiguration", 'DateTime'>
    readonly updatedAt: FieldRef<"BibConfiguration", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * BibConfiguration findUnique
   */
  export type BibConfigurationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BibConfiguration
     */
    select?: BibConfigurationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BibConfigurationInclude<ExtArgs> | null
    /**
     * Filter, which BibConfiguration to fetch.
     */
    where: BibConfigurationWhereUniqueInput
  }

  /**
   * BibConfiguration findUniqueOrThrow
   */
  export type BibConfigurationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BibConfiguration
     */
    select?: BibConfigurationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BibConfigurationInclude<ExtArgs> | null
    /**
     * Filter, which BibConfiguration to fetch.
     */
    where: BibConfigurationWhereUniqueInput
  }

  /**
   * BibConfiguration findFirst
   */
  export type BibConfigurationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BibConfiguration
     */
    select?: BibConfigurationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BibConfigurationInclude<ExtArgs> | null
    /**
     * Filter, which BibConfiguration to fetch.
     */
    where?: BibConfigurationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BibConfigurations to fetch.
     */
    orderBy?: BibConfigurationOrderByWithRelationInput | BibConfigurationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BibConfigurations.
     */
    cursor?: BibConfigurationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BibConfigurations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BibConfigurations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BibConfigurations.
     */
    distinct?: BibConfigurationScalarFieldEnum | BibConfigurationScalarFieldEnum[]
  }

  /**
   * BibConfiguration findFirstOrThrow
   */
  export type BibConfigurationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BibConfiguration
     */
    select?: BibConfigurationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BibConfigurationInclude<ExtArgs> | null
    /**
     * Filter, which BibConfiguration to fetch.
     */
    where?: BibConfigurationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BibConfigurations to fetch.
     */
    orderBy?: BibConfigurationOrderByWithRelationInput | BibConfigurationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BibConfigurations.
     */
    cursor?: BibConfigurationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BibConfigurations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BibConfigurations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BibConfigurations.
     */
    distinct?: BibConfigurationScalarFieldEnum | BibConfigurationScalarFieldEnum[]
  }

  /**
   * BibConfiguration findMany
   */
  export type BibConfigurationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BibConfiguration
     */
    select?: BibConfigurationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BibConfigurationInclude<ExtArgs> | null
    /**
     * Filter, which BibConfigurations to fetch.
     */
    where?: BibConfigurationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BibConfigurations to fetch.
     */
    orderBy?: BibConfigurationOrderByWithRelationInput | BibConfigurationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BibConfigurations.
     */
    cursor?: BibConfigurationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BibConfigurations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BibConfigurations.
     */
    skip?: number
    distinct?: BibConfigurationScalarFieldEnum | BibConfigurationScalarFieldEnum[]
  }

  /**
   * BibConfiguration create
   */
  export type BibConfigurationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BibConfiguration
     */
    select?: BibConfigurationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BibConfigurationInclude<ExtArgs> | null
    /**
     * The data needed to create a BibConfiguration.
     */
    data: XOR<BibConfigurationCreateInput, BibConfigurationUncheckedCreateInput>
  }

  /**
   * BibConfiguration createMany
   */
  export type BibConfigurationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BibConfigurations.
     */
    data: BibConfigurationCreateManyInput | BibConfigurationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BibConfiguration createManyAndReturn
   */
  export type BibConfigurationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BibConfiguration
     */
    select?: BibConfigurationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many BibConfigurations.
     */
    data: BibConfigurationCreateManyInput | BibConfigurationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BibConfigurationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * BibConfiguration update
   */
  export type BibConfigurationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BibConfiguration
     */
    select?: BibConfigurationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BibConfigurationInclude<ExtArgs> | null
    /**
     * The data needed to update a BibConfiguration.
     */
    data: XOR<BibConfigurationUpdateInput, BibConfigurationUncheckedUpdateInput>
    /**
     * Choose, which BibConfiguration to update.
     */
    where: BibConfigurationWhereUniqueInput
  }

  /**
   * BibConfiguration updateMany
   */
  export type BibConfigurationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BibConfigurations.
     */
    data: XOR<BibConfigurationUpdateManyMutationInput, BibConfigurationUncheckedUpdateManyInput>
    /**
     * Filter which BibConfigurations to update
     */
    where?: BibConfigurationWhereInput
  }

  /**
   * BibConfiguration upsert
   */
  export type BibConfigurationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BibConfiguration
     */
    select?: BibConfigurationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BibConfigurationInclude<ExtArgs> | null
    /**
     * The filter to search for the BibConfiguration to update in case it exists.
     */
    where: BibConfigurationWhereUniqueInput
    /**
     * In case the BibConfiguration found by the `where` argument doesn't exist, create a new BibConfiguration with this data.
     */
    create: XOR<BibConfigurationCreateInput, BibConfigurationUncheckedCreateInput>
    /**
     * In case the BibConfiguration was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BibConfigurationUpdateInput, BibConfigurationUncheckedUpdateInput>
  }

  /**
   * BibConfiguration delete
   */
  export type BibConfigurationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BibConfiguration
     */
    select?: BibConfigurationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BibConfigurationInclude<ExtArgs> | null
    /**
     * Filter which BibConfiguration to delete.
     */
    where: BibConfigurationWhereUniqueInput
  }

  /**
   * BibConfiguration deleteMany
   */
  export type BibConfigurationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BibConfigurations to delete
     */
    where?: BibConfigurationWhereInput
  }

  /**
   * BibConfiguration without action
   */
  export type BibConfigurationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BibConfiguration
     */
    select?: BibConfigurationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BibConfigurationInclude<ExtArgs> | null
  }


  /**
   * Model Role
   */

  export type AggregateRole = {
    _count: RoleCountAggregateOutputType | null
    _min: RoleMinAggregateOutputType | null
    _max: RoleMaxAggregateOutputType | null
  }

  export type RoleMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RoleMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RoleCountAggregateOutputType = {
    id: number
    name: number
    description: number
    permissions: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type RoleMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RoleMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RoleCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    permissions?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type RoleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Role to aggregate.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Roles
    **/
    _count?: true | RoleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RoleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RoleMaxAggregateInputType
  }

  export type GetRoleAggregateType<T extends RoleAggregateArgs> = {
        [P in keyof T & keyof AggregateRole]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRole[P]>
      : GetScalarType<T[P], AggregateRole[P]>
  }




  export type RoleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoleWhereInput
    orderBy?: RoleOrderByWithAggregationInput | RoleOrderByWithAggregationInput[]
    by: RoleScalarFieldEnum[] | RoleScalarFieldEnum
    having?: RoleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RoleCountAggregateInputType | true
    _min?: RoleMinAggregateInputType
    _max?: RoleMaxAggregateInputType
  }

  export type RoleGroupByOutputType = {
    id: string
    name: string
    description: string | null
    permissions: JsonValue
    createdAt: Date
    updatedAt: Date
    _count: RoleCountAggregateOutputType | null
    _min: RoleMinAggregateOutputType | null
    _max: RoleMaxAggregateOutputType | null
  }

  type GetRoleGroupByPayload<T extends RoleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RoleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RoleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RoleGroupByOutputType[P]>
            : GetScalarType<T[P], RoleGroupByOutputType[P]>
        }
      >
    >


  export type RoleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    permissions?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    admins?: boolean | Role$adminsArgs<ExtArgs>
    _count?: boolean | RoleCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["role"]>

  export type RoleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    permissions?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["role"]>

  export type RoleSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    permissions?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type RoleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    admins?: boolean | Role$adminsArgs<ExtArgs>
    _count?: boolean | RoleCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type RoleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $RolePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Role"
    objects: {
      admins: Prisma.$AdminPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      permissions: Prisma.JsonValue
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["role"]>
    composites: {}
  }

  type RoleGetPayload<S extends boolean | null | undefined | RoleDefaultArgs> = $Result.GetResult<Prisma.$RolePayload, S>

  type RoleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<RoleFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: RoleCountAggregateInputType | true
    }

  export interface RoleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Role'], meta: { name: 'Role' } }
    /**
     * Find zero or one Role that matches the filter.
     * @param {RoleFindUniqueArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RoleFindUniqueArgs>(args: SelectSubset<T, RoleFindUniqueArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Role that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {RoleFindUniqueOrThrowArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RoleFindUniqueOrThrowArgs>(args: SelectSubset<T, RoleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Role that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleFindFirstArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RoleFindFirstArgs>(args?: SelectSubset<T, RoleFindFirstArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Role that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleFindFirstOrThrowArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RoleFindFirstOrThrowArgs>(args?: SelectSubset<T, RoleFindFirstOrThrowArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Roles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Roles
     * const roles = await prisma.role.findMany()
     * 
     * // Get first 10 Roles
     * const roles = await prisma.role.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const roleWithIdOnly = await prisma.role.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RoleFindManyArgs>(args?: SelectSubset<T, RoleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Role.
     * @param {RoleCreateArgs} args - Arguments to create a Role.
     * @example
     * // Create one Role
     * const Role = await prisma.role.create({
     *   data: {
     *     // ... data to create a Role
     *   }
     * })
     * 
     */
    create<T extends RoleCreateArgs>(args: SelectSubset<T, RoleCreateArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Roles.
     * @param {RoleCreateManyArgs} args - Arguments to create many Roles.
     * @example
     * // Create many Roles
     * const role = await prisma.role.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RoleCreateManyArgs>(args?: SelectSubset<T, RoleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Roles and returns the data saved in the database.
     * @param {RoleCreateManyAndReturnArgs} args - Arguments to create many Roles.
     * @example
     * // Create many Roles
     * const role = await prisma.role.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Roles and only return the `id`
     * const roleWithIdOnly = await prisma.role.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RoleCreateManyAndReturnArgs>(args?: SelectSubset<T, RoleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Role.
     * @param {RoleDeleteArgs} args - Arguments to delete one Role.
     * @example
     * // Delete one Role
     * const Role = await prisma.role.delete({
     *   where: {
     *     // ... filter to delete one Role
     *   }
     * })
     * 
     */
    delete<T extends RoleDeleteArgs>(args: SelectSubset<T, RoleDeleteArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Role.
     * @param {RoleUpdateArgs} args - Arguments to update one Role.
     * @example
     * // Update one Role
     * const role = await prisma.role.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RoleUpdateArgs>(args: SelectSubset<T, RoleUpdateArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Roles.
     * @param {RoleDeleteManyArgs} args - Arguments to filter Roles to delete.
     * @example
     * // Delete a few Roles
     * const { count } = await prisma.role.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RoleDeleteManyArgs>(args?: SelectSubset<T, RoleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Roles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Roles
     * const role = await prisma.role.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RoleUpdateManyArgs>(args: SelectSubset<T, RoleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Role.
     * @param {RoleUpsertArgs} args - Arguments to update or create a Role.
     * @example
     * // Update or create a Role
     * const role = await prisma.role.upsert({
     *   create: {
     *     // ... data to create a Role
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Role we want to update
     *   }
     * })
     */
    upsert<T extends RoleUpsertArgs>(args: SelectSubset<T, RoleUpsertArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Roles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleCountArgs} args - Arguments to filter Roles to count.
     * @example
     * // Count the number of Roles
     * const count = await prisma.role.count({
     *   where: {
     *     // ... the filter for the Roles we want to count
     *   }
     * })
    **/
    count<T extends RoleCountArgs>(
      args?: Subset<T, RoleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RoleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Role.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RoleAggregateArgs>(args: Subset<T, RoleAggregateArgs>): Prisma.PrismaPromise<GetRoleAggregateType<T>>

    /**
     * Group by Role.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RoleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RoleGroupByArgs['orderBy'] }
        : { orderBy?: RoleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RoleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRoleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Role model
   */
  readonly fields: RoleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Role.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RoleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    admins<T extends Role$adminsArgs<ExtArgs> = {}>(args?: Subset<T, Role$adminsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Role model
   */ 
  interface RoleFieldRefs {
    readonly id: FieldRef<"Role", 'String'>
    readonly name: FieldRef<"Role", 'String'>
    readonly description: FieldRef<"Role", 'String'>
    readonly permissions: FieldRef<"Role", 'Json'>
    readonly createdAt: FieldRef<"Role", 'DateTime'>
    readonly updatedAt: FieldRef<"Role", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Role findUnique
   */
  export type RoleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role findUniqueOrThrow
   */
  export type RoleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role findFirst
   */
  export type RoleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Roles.
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Roles.
     */
    distinct?: RoleScalarFieldEnum | RoleScalarFieldEnum[]
  }

  /**
   * Role findFirstOrThrow
   */
  export type RoleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Roles.
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Roles.
     */
    distinct?: RoleScalarFieldEnum | RoleScalarFieldEnum[]
  }

  /**
   * Role findMany
   */
  export type RoleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Roles to fetch.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Roles.
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    distinct?: RoleScalarFieldEnum | RoleScalarFieldEnum[]
  }

  /**
   * Role create
   */
  export type RoleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * The data needed to create a Role.
     */
    data: XOR<RoleCreateInput, RoleUncheckedCreateInput>
  }

  /**
   * Role createMany
   */
  export type RoleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Roles.
     */
    data: RoleCreateManyInput | RoleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Role createManyAndReturn
   */
  export type RoleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Roles.
     */
    data: RoleCreateManyInput | RoleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Role update
   */
  export type RoleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * The data needed to update a Role.
     */
    data: XOR<RoleUpdateInput, RoleUncheckedUpdateInput>
    /**
     * Choose, which Role to update.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role updateMany
   */
  export type RoleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Roles.
     */
    data: XOR<RoleUpdateManyMutationInput, RoleUncheckedUpdateManyInput>
    /**
     * Filter which Roles to update
     */
    where?: RoleWhereInput
  }

  /**
   * Role upsert
   */
  export type RoleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * The filter to search for the Role to update in case it exists.
     */
    where: RoleWhereUniqueInput
    /**
     * In case the Role found by the `where` argument doesn't exist, create a new Role with this data.
     */
    create: XOR<RoleCreateInput, RoleUncheckedCreateInput>
    /**
     * In case the Role was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RoleUpdateInput, RoleUncheckedUpdateInput>
  }

  /**
   * Role delete
   */
  export type RoleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter which Role to delete.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role deleteMany
   */
  export type RoleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Roles to delete
     */
    where?: RoleWhereInput
  }

  /**
   * Role.admins
   */
  export type Role$adminsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminInclude<ExtArgs> | null
    where?: AdminWhereInput
    orderBy?: AdminOrderByWithRelationInput | AdminOrderByWithRelationInput[]
    cursor?: AdminWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AdminScalarFieldEnum | AdminScalarFieldEnum[]
  }

  /**
   * Role without action
   */
  export type RoleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
  }


  /**
   * Model Admin
   */

  export type AggregateAdmin = {
    _count: AdminCountAggregateOutputType | null
    _avg: AdminAvgAggregateOutputType | null
    _sum: AdminSumAggregateOutputType | null
    _min: AdminMinAggregateOutputType | null
    _max: AdminMaxAggregateOutputType | null
  }

  export type AdminAvgAggregateOutputType = {
    tokenVersion: number | null
  }

  export type AdminSumAggregateOutputType = {
    tokenVersion: number | null
  }

  export type AdminMinAggregateOutputType = {
    id: string | null
    username: string | null
    email: string | null
    password: string | null
    fullName: string | null
    roleId: string | null
    isActive: boolean | null
    tokenVersion: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AdminMaxAggregateOutputType = {
    id: string | null
    username: string | null
    email: string | null
    password: string | null
    fullName: string | null
    roleId: string | null
    isActive: boolean | null
    tokenVersion: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AdminCountAggregateOutputType = {
    id: number
    username: number
    email: number
    password: number
    fullName: number
    roleId: number
    isActive: number
    tokenVersion: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AdminAvgAggregateInputType = {
    tokenVersion?: true
  }

  export type AdminSumAggregateInputType = {
    tokenVersion?: true
  }

  export type AdminMinAggregateInputType = {
    id?: true
    username?: true
    email?: true
    password?: true
    fullName?: true
    roleId?: true
    isActive?: true
    tokenVersion?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AdminMaxAggregateInputType = {
    id?: true
    username?: true
    email?: true
    password?: true
    fullName?: true
    roleId?: true
    isActive?: true
    tokenVersion?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AdminCountAggregateInputType = {
    id?: true
    username?: true
    email?: true
    password?: true
    fullName?: true
    roleId?: true
    isActive?: true
    tokenVersion?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AdminAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Admin to aggregate.
     */
    where?: AdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Admins to fetch.
     */
    orderBy?: AdminOrderByWithRelationInput | AdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Admins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Admins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Admins
    **/
    _count?: true | AdminCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AdminAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AdminSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AdminMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AdminMaxAggregateInputType
  }

  export type GetAdminAggregateType<T extends AdminAggregateArgs> = {
        [P in keyof T & keyof AggregateAdmin]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAdmin[P]>
      : GetScalarType<T[P], AggregateAdmin[P]>
  }




  export type AdminGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AdminWhereInput
    orderBy?: AdminOrderByWithAggregationInput | AdminOrderByWithAggregationInput[]
    by: AdminScalarFieldEnum[] | AdminScalarFieldEnum
    having?: AdminScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AdminCountAggregateInputType | true
    _avg?: AdminAvgAggregateInputType
    _sum?: AdminSumAggregateInputType
    _min?: AdminMinAggregateInputType
    _max?: AdminMaxAggregateInputType
  }

  export type AdminGroupByOutputType = {
    id: string
    username: string
    email: string
    password: string
    fullName: string
    roleId: string
    isActive: boolean
    tokenVersion: number
    createdAt: Date
    updatedAt: Date
    _count: AdminCountAggregateOutputType | null
    _avg: AdminAvgAggregateOutputType | null
    _sum: AdminSumAggregateOutputType | null
    _min: AdminMinAggregateOutputType | null
    _max: AdminMaxAggregateOutputType | null
  }

  type GetAdminGroupByPayload<T extends AdminGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AdminGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AdminGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AdminGroupByOutputType[P]>
            : GetScalarType<T[P], AdminGroupByOutputType[P]>
        }
      >
    >


  export type AdminSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    email?: boolean
    password?: boolean
    fullName?: boolean
    roleId?: boolean
    isActive?: boolean
    tokenVersion?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    role?: boolean | RoleDefaultArgs<ExtArgs>
    logs?: boolean | Admin$logsArgs<ExtArgs>
    _count?: boolean | AdminCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["admin"]>

  export type AdminSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    email?: boolean
    password?: boolean
    fullName?: boolean
    roleId?: boolean
    isActive?: boolean
    tokenVersion?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    role?: boolean | RoleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["admin"]>

  export type AdminSelectScalar = {
    id?: boolean
    username?: boolean
    email?: boolean
    password?: boolean
    fullName?: boolean
    roleId?: boolean
    isActive?: boolean
    tokenVersion?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AdminInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    role?: boolean | RoleDefaultArgs<ExtArgs>
    logs?: boolean | Admin$logsArgs<ExtArgs>
    _count?: boolean | AdminCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AdminIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    role?: boolean | RoleDefaultArgs<ExtArgs>
  }

  export type $AdminPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Admin"
    objects: {
      role: Prisma.$RolePayload<ExtArgs>
      logs: Prisma.$LogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      username: string
      email: string
      password: string
      fullName: string
      roleId: string
      isActive: boolean
      tokenVersion: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["admin"]>
    composites: {}
  }

  type AdminGetPayload<S extends boolean | null | undefined | AdminDefaultArgs> = $Result.GetResult<Prisma.$AdminPayload, S>

  type AdminCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AdminFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AdminCountAggregateInputType | true
    }

  export interface AdminDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Admin'], meta: { name: 'Admin' } }
    /**
     * Find zero or one Admin that matches the filter.
     * @param {AdminFindUniqueArgs} args - Arguments to find a Admin
     * @example
     * // Get one Admin
     * const admin = await prisma.admin.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AdminFindUniqueArgs>(args: SelectSubset<T, AdminFindUniqueArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Admin that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AdminFindUniqueOrThrowArgs} args - Arguments to find a Admin
     * @example
     * // Get one Admin
     * const admin = await prisma.admin.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AdminFindUniqueOrThrowArgs>(args: SelectSubset<T, AdminFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Admin that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminFindFirstArgs} args - Arguments to find a Admin
     * @example
     * // Get one Admin
     * const admin = await prisma.admin.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AdminFindFirstArgs>(args?: SelectSubset<T, AdminFindFirstArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Admin that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminFindFirstOrThrowArgs} args - Arguments to find a Admin
     * @example
     * // Get one Admin
     * const admin = await prisma.admin.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AdminFindFirstOrThrowArgs>(args?: SelectSubset<T, AdminFindFirstOrThrowArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Admins that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Admins
     * const admins = await prisma.admin.findMany()
     * 
     * // Get first 10 Admins
     * const admins = await prisma.admin.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const adminWithIdOnly = await prisma.admin.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AdminFindManyArgs>(args?: SelectSubset<T, AdminFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Admin.
     * @param {AdminCreateArgs} args - Arguments to create a Admin.
     * @example
     * // Create one Admin
     * const Admin = await prisma.admin.create({
     *   data: {
     *     // ... data to create a Admin
     *   }
     * })
     * 
     */
    create<T extends AdminCreateArgs>(args: SelectSubset<T, AdminCreateArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Admins.
     * @param {AdminCreateManyArgs} args - Arguments to create many Admins.
     * @example
     * // Create many Admins
     * const admin = await prisma.admin.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AdminCreateManyArgs>(args?: SelectSubset<T, AdminCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Admins and returns the data saved in the database.
     * @param {AdminCreateManyAndReturnArgs} args - Arguments to create many Admins.
     * @example
     * // Create many Admins
     * const admin = await prisma.admin.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Admins and only return the `id`
     * const adminWithIdOnly = await prisma.admin.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AdminCreateManyAndReturnArgs>(args?: SelectSubset<T, AdminCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Admin.
     * @param {AdminDeleteArgs} args - Arguments to delete one Admin.
     * @example
     * // Delete one Admin
     * const Admin = await prisma.admin.delete({
     *   where: {
     *     // ... filter to delete one Admin
     *   }
     * })
     * 
     */
    delete<T extends AdminDeleteArgs>(args: SelectSubset<T, AdminDeleteArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Admin.
     * @param {AdminUpdateArgs} args - Arguments to update one Admin.
     * @example
     * // Update one Admin
     * const admin = await prisma.admin.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AdminUpdateArgs>(args: SelectSubset<T, AdminUpdateArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Admins.
     * @param {AdminDeleteManyArgs} args - Arguments to filter Admins to delete.
     * @example
     * // Delete a few Admins
     * const { count } = await prisma.admin.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AdminDeleteManyArgs>(args?: SelectSubset<T, AdminDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Admins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Admins
     * const admin = await prisma.admin.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AdminUpdateManyArgs>(args: SelectSubset<T, AdminUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Admin.
     * @param {AdminUpsertArgs} args - Arguments to update or create a Admin.
     * @example
     * // Update or create a Admin
     * const admin = await prisma.admin.upsert({
     *   create: {
     *     // ... data to create a Admin
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Admin we want to update
     *   }
     * })
     */
    upsert<T extends AdminUpsertArgs>(args: SelectSubset<T, AdminUpsertArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Admins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminCountArgs} args - Arguments to filter Admins to count.
     * @example
     * // Count the number of Admins
     * const count = await prisma.admin.count({
     *   where: {
     *     // ... the filter for the Admins we want to count
     *   }
     * })
    **/
    count<T extends AdminCountArgs>(
      args?: Subset<T, AdminCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AdminCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Admin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AdminAggregateArgs>(args: Subset<T, AdminAggregateArgs>): Prisma.PrismaPromise<GetAdminAggregateType<T>>

    /**
     * Group by Admin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AdminGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AdminGroupByArgs['orderBy'] }
        : { orderBy?: AdminGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AdminGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAdminGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Admin model
   */
  readonly fields: AdminFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Admin.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AdminClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    role<T extends RoleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RoleDefaultArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    logs<T extends Admin$logsArgs<ExtArgs> = {}>(args?: Subset<T, Admin$logsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LogPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Admin model
   */ 
  interface AdminFieldRefs {
    readonly id: FieldRef<"Admin", 'String'>
    readonly username: FieldRef<"Admin", 'String'>
    readonly email: FieldRef<"Admin", 'String'>
    readonly password: FieldRef<"Admin", 'String'>
    readonly fullName: FieldRef<"Admin", 'String'>
    readonly roleId: FieldRef<"Admin", 'String'>
    readonly isActive: FieldRef<"Admin", 'Boolean'>
    readonly tokenVersion: FieldRef<"Admin", 'Int'>
    readonly createdAt: FieldRef<"Admin", 'DateTime'>
    readonly updatedAt: FieldRef<"Admin", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Admin findUnique
   */
  export type AdminFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminInclude<ExtArgs> | null
    /**
     * Filter, which Admin to fetch.
     */
    where: AdminWhereUniqueInput
  }

  /**
   * Admin findUniqueOrThrow
   */
  export type AdminFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminInclude<ExtArgs> | null
    /**
     * Filter, which Admin to fetch.
     */
    where: AdminWhereUniqueInput
  }

  /**
   * Admin findFirst
   */
  export type AdminFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminInclude<ExtArgs> | null
    /**
     * Filter, which Admin to fetch.
     */
    where?: AdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Admins to fetch.
     */
    orderBy?: AdminOrderByWithRelationInput | AdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Admins.
     */
    cursor?: AdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Admins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Admins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Admins.
     */
    distinct?: AdminScalarFieldEnum | AdminScalarFieldEnum[]
  }

  /**
   * Admin findFirstOrThrow
   */
  export type AdminFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminInclude<ExtArgs> | null
    /**
     * Filter, which Admin to fetch.
     */
    where?: AdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Admins to fetch.
     */
    orderBy?: AdminOrderByWithRelationInput | AdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Admins.
     */
    cursor?: AdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Admins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Admins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Admins.
     */
    distinct?: AdminScalarFieldEnum | AdminScalarFieldEnum[]
  }

  /**
   * Admin findMany
   */
  export type AdminFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminInclude<ExtArgs> | null
    /**
     * Filter, which Admins to fetch.
     */
    where?: AdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Admins to fetch.
     */
    orderBy?: AdminOrderByWithRelationInput | AdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Admins.
     */
    cursor?: AdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Admins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Admins.
     */
    skip?: number
    distinct?: AdminScalarFieldEnum | AdminScalarFieldEnum[]
  }

  /**
   * Admin create
   */
  export type AdminCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminInclude<ExtArgs> | null
    /**
     * The data needed to create a Admin.
     */
    data: XOR<AdminCreateInput, AdminUncheckedCreateInput>
  }

  /**
   * Admin createMany
   */
  export type AdminCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Admins.
     */
    data: AdminCreateManyInput | AdminCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Admin createManyAndReturn
   */
  export type AdminCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Admins.
     */
    data: AdminCreateManyInput | AdminCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Admin update
   */
  export type AdminUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminInclude<ExtArgs> | null
    /**
     * The data needed to update a Admin.
     */
    data: XOR<AdminUpdateInput, AdminUncheckedUpdateInput>
    /**
     * Choose, which Admin to update.
     */
    where: AdminWhereUniqueInput
  }

  /**
   * Admin updateMany
   */
  export type AdminUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Admins.
     */
    data: XOR<AdminUpdateManyMutationInput, AdminUncheckedUpdateManyInput>
    /**
     * Filter which Admins to update
     */
    where?: AdminWhereInput
  }

  /**
   * Admin upsert
   */
  export type AdminUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminInclude<ExtArgs> | null
    /**
     * The filter to search for the Admin to update in case it exists.
     */
    where: AdminWhereUniqueInput
    /**
     * In case the Admin found by the `where` argument doesn't exist, create a new Admin with this data.
     */
    create: XOR<AdminCreateInput, AdminUncheckedCreateInput>
    /**
     * In case the Admin was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AdminUpdateInput, AdminUncheckedUpdateInput>
  }

  /**
   * Admin delete
   */
  export type AdminDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminInclude<ExtArgs> | null
    /**
     * Filter which Admin to delete.
     */
    where: AdminWhereUniqueInput
  }

  /**
   * Admin deleteMany
   */
  export type AdminDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Admins to delete
     */
    where?: AdminWhereInput
  }

  /**
   * Admin.logs
   */
  export type Admin$logsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Log
     */
    select?: LogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LogInclude<ExtArgs> | null
    where?: LogWhereInput
    orderBy?: LogOrderByWithRelationInput | LogOrderByWithRelationInput[]
    cursor?: LogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LogScalarFieldEnum | LogScalarFieldEnum[]
  }

  /**
   * Admin without action
   */
  export type AdminDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminInclude<ExtArgs> | null
  }


  /**
   * Model AppSetting
   */

  export type AggregateAppSetting = {
    _count: AppSettingCountAggregateOutputType | null
    _min: AppSettingMinAggregateOutputType | null
    _max: AppSettingMaxAggregateOutputType | null
  }

  export type AppSettingMinAggregateOutputType = {
    key: string | null
    value: string | null
    description: string | null
    updatedAt: Date | null
  }

  export type AppSettingMaxAggregateOutputType = {
    key: string | null
    value: string | null
    description: string | null
    updatedAt: Date | null
  }

  export type AppSettingCountAggregateOutputType = {
    key: number
    value: number
    description: number
    updatedAt: number
    _all: number
  }


  export type AppSettingMinAggregateInputType = {
    key?: true
    value?: true
    description?: true
    updatedAt?: true
  }

  export type AppSettingMaxAggregateInputType = {
    key?: true
    value?: true
    description?: true
    updatedAt?: true
  }

  export type AppSettingCountAggregateInputType = {
    key?: true
    value?: true
    description?: true
    updatedAt?: true
    _all?: true
  }

  export type AppSettingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AppSetting to aggregate.
     */
    where?: AppSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AppSettings to fetch.
     */
    orderBy?: AppSettingOrderByWithRelationInput | AppSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AppSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AppSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AppSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AppSettings
    **/
    _count?: true | AppSettingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AppSettingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AppSettingMaxAggregateInputType
  }

  export type GetAppSettingAggregateType<T extends AppSettingAggregateArgs> = {
        [P in keyof T & keyof AggregateAppSetting]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAppSetting[P]>
      : GetScalarType<T[P], AggregateAppSetting[P]>
  }




  export type AppSettingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AppSettingWhereInput
    orderBy?: AppSettingOrderByWithAggregationInput | AppSettingOrderByWithAggregationInput[]
    by: AppSettingScalarFieldEnum[] | AppSettingScalarFieldEnum
    having?: AppSettingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AppSettingCountAggregateInputType | true
    _min?: AppSettingMinAggregateInputType
    _max?: AppSettingMaxAggregateInputType
  }

  export type AppSettingGroupByOutputType = {
    key: string
    value: string
    description: string | null
    updatedAt: Date
    _count: AppSettingCountAggregateOutputType | null
    _min: AppSettingMinAggregateOutputType | null
    _max: AppSettingMaxAggregateOutputType | null
  }

  type GetAppSettingGroupByPayload<T extends AppSettingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AppSettingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AppSettingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AppSettingGroupByOutputType[P]>
            : GetScalarType<T[P], AppSettingGroupByOutputType[P]>
        }
      >
    >


  export type AppSettingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    key?: boolean
    value?: boolean
    description?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["appSetting"]>

  export type AppSettingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    key?: boolean
    value?: boolean
    description?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["appSetting"]>

  export type AppSettingSelectScalar = {
    key?: boolean
    value?: boolean
    description?: boolean
    updatedAt?: boolean
  }


  export type $AppSettingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AppSetting"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      key: string
      value: string
      description: string | null
      updatedAt: Date
    }, ExtArgs["result"]["appSetting"]>
    composites: {}
  }

  type AppSettingGetPayload<S extends boolean | null | undefined | AppSettingDefaultArgs> = $Result.GetResult<Prisma.$AppSettingPayload, S>

  type AppSettingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AppSettingFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AppSettingCountAggregateInputType | true
    }

  export interface AppSettingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AppSetting'], meta: { name: 'AppSetting' } }
    /**
     * Find zero or one AppSetting that matches the filter.
     * @param {AppSettingFindUniqueArgs} args - Arguments to find a AppSetting
     * @example
     * // Get one AppSetting
     * const appSetting = await prisma.appSetting.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AppSettingFindUniqueArgs>(args: SelectSubset<T, AppSettingFindUniqueArgs<ExtArgs>>): Prisma__AppSettingClient<$Result.GetResult<Prisma.$AppSettingPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one AppSetting that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AppSettingFindUniqueOrThrowArgs} args - Arguments to find a AppSetting
     * @example
     * // Get one AppSetting
     * const appSetting = await prisma.appSetting.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AppSettingFindUniqueOrThrowArgs>(args: SelectSubset<T, AppSettingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AppSettingClient<$Result.GetResult<Prisma.$AppSettingPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first AppSetting that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppSettingFindFirstArgs} args - Arguments to find a AppSetting
     * @example
     * // Get one AppSetting
     * const appSetting = await prisma.appSetting.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AppSettingFindFirstArgs>(args?: SelectSubset<T, AppSettingFindFirstArgs<ExtArgs>>): Prisma__AppSettingClient<$Result.GetResult<Prisma.$AppSettingPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first AppSetting that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppSettingFindFirstOrThrowArgs} args - Arguments to find a AppSetting
     * @example
     * // Get one AppSetting
     * const appSetting = await prisma.appSetting.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AppSettingFindFirstOrThrowArgs>(args?: SelectSubset<T, AppSettingFindFirstOrThrowArgs<ExtArgs>>): Prisma__AppSettingClient<$Result.GetResult<Prisma.$AppSettingPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more AppSettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppSettingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AppSettings
     * const appSettings = await prisma.appSetting.findMany()
     * 
     * // Get first 10 AppSettings
     * const appSettings = await prisma.appSetting.findMany({ take: 10 })
     * 
     * // Only select the `key`
     * const appSettingWithKeyOnly = await prisma.appSetting.findMany({ select: { key: true } })
     * 
     */
    findMany<T extends AppSettingFindManyArgs>(args?: SelectSubset<T, AppSettingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppSettingPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a AppSetting.
     * @param {AppSettingCreateArgs} args - Arguments to create a AppSetting.
     * @example
     * // Create one AppSetting
     * const AppSetting = await prisma.appSetting.create({
     *   data: {
     *     // ... data to create a AppSetting
     *   }
     * })
     * 
     */
    create<T extends AppSettingCreateArgs>(args: SelectSubset<T, AppSettingCreateArgs<ExtArgs>>): Prisma__AppSettingClient<$Result.GetResult<Prisma.$AppSettingPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many AppSettings.
     * @param {AppSettingCreateManyArgs} args - Arguments to create many AppSettings.
     * @example
     * // Create many AppSettings
     * const appSetting = await prisma.appSetting.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AppSettingCreateManyArgs>(args?: SelectSubset<T, AppSettingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AppSettings and returns the data saved in the database.
     * @param {AppSettingCreateManyAndReturnArgs} args - Arguments to create many AppSettings.
     * @example
     * // Create many AppSettings
     * const appSetting = await prisma.appSetting.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AppSettings and only return the `key`
     * const appSettingWithKeyOnly = await prisma.appSetting.createManyAndReturn({ 
     *   select: { key: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AppSettingCreateManyAndReturnArgs>(args?: SelectSubset<T, AppSettingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppSettingPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a AppSetting.
     * @param {AppSettingDeleteArgs} args - Arguments to delete one AppSetting.
     * @example
     * // Delete one AppSetting
     * const AppSetting = await prisma.appSetting.delete({
     *   where: {
     *     // ... filter to delete one AppSetting
     *   }
     * })
     * 
     */
    delete<T extends AppSettingDeleteArgs>(args: SelectSubset<T, AppSettingDeleteArgs<ExtArgs>>): Prisma__AppSettingClient<$Result.GetResult<Prisma.$AppSettingPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one AppSetting.
     * @param {AppSettingUpdateArgs} args - Arguments to update one AppSetting.
     * @example
     * // Update one AppSetting
     * const appSetting = await prisma.appSetting.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AppSettingUpdateArgs>(args: SelectSubset<T, AppSettingUpdateArgs<ExtArgs>>): Prisma__AppSettingClient<$Result.GetResult<Prisma.$AppSettingPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more AppSettings.
     * @param {AppSettingDeleteManyArgs} args - Arguments to filter AppSettings to delete.
     * @example
     * // Delete a few AppSettings
     * const { count } = await prisma.appSetting.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AppSettingDeleteManyArgs>(args?: SelectSubset<T, AppSettingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AppSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppSettingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AppSettings
     * const appSetting = await prisma.appSetting.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AppSettingUpdateManyArgs>(args: SelectSubset<T, AppSettingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AppSetting.
     * @param {AppSettingUpsertArgs} args - Arguments to update or create a AppSetting.
     * @example
     * // Update or create a AppSetting
     * const appSetting = await prisma.appSetting.upsert({
     *   create: {
     *     // ... data to create a AppSetting
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AppSetting we want to update
     *   }
     * })
     */
    upsert<T extends AppSettingUpsertArgs>(args: SelectSubset<T, AppSettingUpsertArgs<ExtArgs>>): Prisma__AppSettingClient<$Result.GetResult<Prisma.$AppSettingPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of AppSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppSettingCountArgs} args - Arguments to filter AppSettings to count.
     * @example
     * // Count the number of AppSettings
     * const count = await prisma.appSetting.count({
     *   where: {
     *     // ... the filter for the AppSettings we want to count
     *   }
     * })
    **/
    count<T extends AppSettingCountArgs>(
      args?: Subset<T, AppSettingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AppSettingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AppSetting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppSettingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AppSettingAggregateArgs>(args: Subset<T, AppSettingAggregateArgs>): Prisma.PrismaPromise<GetAppSettingAggregateType<T>>

    /**
     * Group by AppSetting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppSettingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AppSettingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AppSettingGroupByArgs['orderBy'] }
        : { orderBy?: AppSettingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AppSettingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAppSettingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AppSetting model
   */
  readonly fields: AppSettingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AppSetting.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AppSettingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AppSetting model
   */ 
  interface AppSettingFieldRefs {
    readonly key: FieldRef<"AppSetting", 'String'>
    readonly value: FieldRef<"AppSetting", 'String'>
    readonly description: FieldRef<"AppSetting", 'String'>
    readonly updatedAt: FieldRef<"AppSetting", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AppSetting findUnique
   */
  export type AppSettingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppSetting
     */
    select?: AppSettingSelect<ExtArgs> | null
    /**
     * Filter, which AppSetting to fetch.
     */
    where: AppSettingWhereUniqueInput
  }

  /**
   * AppSetting findUniqueOrThrow
   */
  export type AppSettingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppSetting
     */
    select?: AppSettingSelect<ExtArgs> | null
    /**
     * Filter, which AppSetting to fetch.
     */
    where: AppSettingWhereUniqueInput
  }

  /**
   * AppSetting findFirst
   */
  export type AppSettingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppSetting
     */
    select?: AppSettingSelect<ExtArgs> | null
    /**
     * Filter, which AppSetting to fetch.
     */
    where?: AppSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AppSettings to fetch.
     */
    orderBy?: AppSettingOrderByWithRelationInput | AppSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AppSettings.
     */
    cursor?: AppSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AppSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AppSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AppSettings.
     */
    distinct?: AppSettingScalarFieldEnum | AppSettingScalarFieldEnum[]
  }

  /**
   * AppSetting findFirstOrThrow
   */
  export type AppSettingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppSetting
     */
    select?: AppSettingSelect<ExtArgs> | null
    /**
     * Filter, which AppSetting to fetch.
     */
    where?: AppSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AppSettings to fetch.
     */
    orderBy?: AppSettingOrderByWithRelationInput | AppSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AppSettings.
     */
    cursor?: AppSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AppSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AppSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AppSettings.
     */
    distinct?: AppSettingScalarFieldEnum | AppSettingScalarFieldEnum[]
  }

  /**
   * AppSetting findMany
   */
  export type AppSettingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppSetting
     */
    select?: AppSettingSelect<ExtArgs> | null
    /**
     * Filter, which AppSettings to fetch.
     */
    where?: AppSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AppSettings to fetch.
     */
    orderBy?: AppSettingOrderByWithRelationInput | AppSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AppSettings.
     */
    cursor?: AppSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AppSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AppSettings.
     */
    skip?: number
    distinct?: AppSettingScalarFieldEnum | AppSettingScalarFieldEnum[]
  }

  /**
   * AppSetting create
   */
  export type AppSettingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppSetting
     */
    select?: AppSettingSelect<ExtArgs> | null
    /**
     * The data needed to create a AppSetting.
     */
    data: XOR<AppSettingCreateInput, AppSettingUncheckedCreateInput>
  }

  /**
   * AppSetting createMany
   */
  export type AppSettingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AppSettings.
     */
    data: AppSettingCreateManyInput | AppSettingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AppSetting createManyAndReturn
   */
  export type AppSettingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppSetting
     */
    select?: AppSettingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many AppSettings.
     */
    data: AppSettingCreateManyInput | AppSettingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AppSetting update
   */
  export type AppSettingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppSetting
     */
    select?: AppSettingSelect<ExtArgs> | null
    /**
     * The data needed to update a AppSetting.
     */
    data: XOR<AppSettingUpdateInput, AppSettingUncheckedUpdateInput>
    /**
     * Choose, which AppSetting to update.
     */
    where: AppSettingWhereUniqueInput
  }

  /**
   * AppSetting updateMany
   */
  export type AppSettingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AppSettings.
     */
    data: XOR<AppSettingUpdateManyMutationInput, AppSettingUncheckedUpdateManyInput>
    /**
     * Filter which AppSettings to update
     */
    where?: AppSettingWhereInput
  }

  /**
   * AppSetting upsert
   */
  export type AppSettingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppSetting
     */
    select?: AppSettingSelect<ExtArgs> | null
    /**
     * The filter to search for the AppSetting to update in case it exists.
     */
    where: AppSettingWhereUniqueInput
    /**
     * In case the AppSetting found by the `where` argument doesn't exist, create a new AppSetting with this data.
     */
    create: XOR<AppSettingCreateInput, AppSettingUncheckedCreateInput>
    /**
     * In case the AppSetting was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AppSettingUpdateInput, AppSettingUncheckedUpdateInput>
  }

  /**
   * AppSetting delete
   */
  export type AppSettingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppSetting
     */
    select?: AppSettingSelect<ExtArgs> | null
    /**
     * Filter which AppSetting to delete.
     */
    where: AppSettingWhereUniqueInput
  }

  /**
   * AppSetting deleteMany
   */
  export type AppSettingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AppSettings to delete
     */
    where?: AppSettingWhereInput
  }

  /**
   * AppSetting without action
   */
  export type AppSettingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppSetting
     */
    select?: AppSettingSelect<ExtArgs> | null
  }


  /**
   * Model RoutePoint
   */

  export type AggregateRoutePoint = {
    _count: RoutePointCountAggregateOutputType | null
    _avg: RoutePointAvgAggregateOutputType | null
    _sum: RoutePointSumAggregateOutputType | null
    _min: RoutePointMinAggregateOutputType | null
    _max: RoutePointMaxAggregateOutputType | null
  }

  export type RoutePointAvgAggregateOutputType = {
    orderIndex: number | null
  }

  export type RoutePointSumAggregateOutputType = {
    orderIndex: number | null
  }

  export type RoutePointMinAggregateOutputType = {
    id: string | null
    orderIndex: number | null
    name: string | null
    distanceKm: string | null
    category: string | null
    description: string | null
    icon: string | null
    image: string | null
    isWaterStation: boolean | null
    isMedicalSpot: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RoutePointMaxAggregateOutputType = {
    id: string | null
    orderIndex: number | null
    name: string | null
    distanceKm: string | null
    category: string | null
    description: string | null
    icon: string | null
    image: string | null
    isWaterStation: boolean | null
    isMedicalSpot: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RoutePointCountAggregateOutputType = {
    id: number
    orderIndex: number
    name: number
    distanceKm: number
    category: number
    description: number
    icon: number
    image: number
    isWaterStation: number
    isMedicalSpot: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type RoutePointAvgAggregateInputType = {
    orderIndex?: true
  }

  export type RoutePointSumAggregateInputType = {
    orderIndex?: true
  }

  export type RoutePointMinAggregateInputType = {
    id?: true
    orderIndex?: true
    name?: true
    distanceKm?: true
    category?: true
    description?: true
    icon?: true
    image?: true
    isWaterStation?: true
    isMedicalSpot?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RoutePointMaxAggregateInputType = {
    id?: true
    orderIndex?: true
    name?: true
    distanceKm?: true
    category?: true
    description?: true
    icon?: true
    image?: true
    isWaterStation?: true
    isMedicalSpot?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RoutePointCountAggregateInputType = {
    id?: true
    orderIndex?: true
    name?: true
    distanceKm?: true
    category?: true
    description?: true
    icon?: true
    image?: true
    isWaterStation?: true
    isMedicalSpot?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type RoutePointAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RoutePoint to aggregate.
     */
    where?: RoutePointWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoutePoints to fetch.
     */
    orderBy?: RoutePointOrderByWithRelationInput | RoutePointOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RoutePointWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoutePoints from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoutePoints.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RoutePoints
    **/
    _count?: true | RoutePointCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RoutePointAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RoutePointSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RoutePointMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RoutePointMaxAggregateInputType
  }

  export type GetRoutePointAggregateType<T extends RoutePointAggregateArgs> = {
        [P in keyof T & keyof AggregateRoutePoint]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRoutePoint[P]>
      : GetScalarType<T[P], AggregateRoutePoint[P]>
  }




  export type RoutePointGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoutePointWhereInput
    orderBy?: RoutePointOrderByWithAggregationInput | RoutePointOrderByWithAggregationInput[]
    by: RoutePointScalarFieldEnum[] | RoutePointScalarFieldEnum
    having?: RoutePointScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RoutePointCountAggregateInputType | true
    _avg?: RoutePointAvgAggregateInputType
    _sum?: RoutePointSumAggregateInputType
    _min?: RoutePointMinAggregateInputType
    _max?: RoutePointMaxAggregateInputType
  }

  export type RoutePointGroupByOutputType = {
    id: string
    orderIndex: number
    name: string
    distanceKm: string
    category: string
    description: string
    icon: string | null
    image: string | null
    isWaterStation: boolean
    isMedicalSpot: boolean
    createdAt: Date
    updatedAt: Date
    _count: RoutePointCountAggregateOutputType | null
    _avg: RoutePointAvgAggregateOutputType | null
    _sum: RoutePointSumAggregateOutputType | null
    _min: RoutePointMinAggregateOutputType | null
    _max: RoutePointMaxAggregateOutputType | null
  }

  type GetRoutePointGroupByPayload<T extends RoutePointGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RoutePointGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RoutePointGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RoutePointGroupByOutputType[P]>
            : GetScalarType<T[P], RoutePointGroupByOutputType[P]>
        }
      >
    >


  export type RoutePointSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderIndex?: boolean
    name?: boolean
    distanceKm?: boolean
    category?: boolean
    description?: boolean
    icon?: boolean
    image?: boolean
    isWaterStation?: boolean
    isMedicalSpot?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["routePoint"]>

  export type RoutePointSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderIndex?: boolean
    name?: boolean
    distanceKm?: boolean
    category?: boolean
    description?: boolean
    icon?: boolean
    image?: boolean
    isWaterStation?: boolean
    isMedicalSpot?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["routePoint"]>

  export type RoutePointSelectScalar = {
    id?: boolean
    orderIndex?: boolean
    name?: boolean
    distanceKm?: boolean
    category?: boolean
    description?: boolean
    icon?: boolean
    image?: boolean
    isWaterStation?: boolean
    isMedicalSpot?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $RoutePointPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RoutePoint"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      orderIndex: number
      name: string
      distanceKm: string
      category: string
      description: string
      icon: string | null
      image: string | null
      isWaterStation: boolean
      isMedicalSpot: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["routePoint"]>
    composites: {}
  }

  type RoutePointGetPayload<S extends boolean | null | undefined | RoutePointDefaultArgs> = $Result.GetResult<Prisma.$RoutePointPayload, S>

  type RoutePointCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<RoutePointFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: RoutePointCountAggregateInputType | true
    }

  export interface RoutePointDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RoutePoint'], meta: { name: 'RoutePoint' } }
    /**
     * Find zero or one RoutePoint that matches the filter.
     * @param {RoutePointFindUniqueArgs} args - Arguments to find a RoutePoint
     * @example
     * // Get one RoutePoint
     * const routePoint = await prisma.routePoint.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RoutePointFindUniqueArgs>(args: SelectSubset<T, RoutePointFindUniqueArgs<ExtArgs>>): Prisma__RoutePointClient<$Result.GetResult<Prisma.$RoutePointPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one RoutePoint that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {RoutePointFindUniqueOrThrowArgs} args - Arguments to find a RoutePoint
     * @example
     * // Get one RoutePoint
     * const routePoint = await prisma.routePoint.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RoutePointFindUniqueOrThrowArgs>(args: SelectSubset<T, RoutePointFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RoutePointClient<$Result.GetResult<Prisma.$RoutePointPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first RoutePoint that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoutePointFindFirstArgs} args - Arguments to find a RoutePoint
     * @example
     * // Get one RoutePoint
     * const routePoint = await prisma.routePoint.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RoutePointFindFirstArgs>(args?: SelectSubset<T, RoutePointFindFirstArgs<ExtArgs>>): Prisma__RoutePointClient<$Result.GetResult<Prisma.$RoutePointPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first RoutePoint that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoutePointFindFirstOrThrowArgs} args - Arguments to find a RoutePoint
     * @example
     * // Get one RoutePoint
     * const routePoint = await prisma.routePoint.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RoutePointFindFirstOrThrowArgs>(args?: SelectSubset<T, RoutePointFindFirstOrThrowArgs<ExtArgs>>): Prisma__RoutePointClient<$Result.GetResult<Prisma.$RoutePointPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more RoutePoints that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoutePointFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RoutePoints
     * const routePoints = await prisma.routePoint.findMany()
     * 
     * // Get first 10 RoutePoints
     * const routePoints = await prisma.routePoint.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const routePointWithIdOnly = await prisma.routePoint.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RoutePointFindManyArgs>(args?: SelectSubset<T, RoutePointFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoutePointPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a RoutePoint.
     * @param {RoutePointCreateArgs} args - Arguments to create a RoutePoint.
     * @example
     * // Create one RoutePoint
     * const RoutePoint = await prisma.routePoint.create({
     *   data: {
     *     // ... data to create a RoutePoint
     *   }
     * })
     * 
     */
    create<T extends RoutePointCreateArgs>(args: SelectSubset<T, RoutePointCreateArgs<ExtArgs>>): Prisma__RoutePointClient<$Result.GetResult<Prisma.$RoutePointPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many RoutePoints.
     * @param {RoutePointCreateManyArgs} args - Arguments to create many RoutePoints.
     * @example
     * // Create many RoutePoints
     * const routePoint = await prisma.routePoint.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RoutePointCreateManyArgs>(args?: SelectSubset<T, RoutePointCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RoutePoints and returns the data saved in the database.
     * @param {RoutePointCreateManyAndReturnArgs} args - Arguments to create many RoutePoints.
     * @example
     * // Create many RoutePoints
     * const routePoint = await prisma.routePoint.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RoutePoints and only return the `id`
     * const routePointWithIdOnly = await prisma.routePoint.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RoutePointCreateManyAndReturnArgs>(args?: SelectSubset<T, RoutePointCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoutePointPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a RoutePoint.
     * @param {RoutePointDeleteArgs} args - Arguments to delete one RoutePoint.
     * @example
     * // Delete one RoutePoint
     * const RoutePoint = await prisma.routePoint.delete({
     *   where: {
     *     // ... filter to delete one RoutePoint
     *   }
     * })
     * 
     */
    delete<T extends RoutePointDeleteArgs>(args: SelectSubset<T, RoutePointDeleteArgs<ExtArgs>>): Prisma__RoutePointClient<$Result.GetResult<Prisma.$RoutePointPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one RoutePoint.
     * @param {RoutePointUpdateArgs} args - Arguments to update one RoutePoint.
     * @example
     * // Update one RoutePoint
     * const routePoint = await prisma.routePoint.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RoutePointUpdateArgs>(args: SelectSubset<T, RoutePointUpdateArgs<ExtArgs>>): Prisma__RoutePointClient<$Result.GetResult<Prisma.$RoutePointPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more RoutePoints.
     * @param {RoutePointDeleteManyArgs} args - Arguments to filter RoutePoints to delete.
     * @example
     * // Delete a few RoutePoints
     * const { count } = await prisma.routePoint.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RoutePointDeleteManyArgs>(args?: SelectSubset<T, RoutePointDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RoutePoints.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoutePointUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RoutePoints
     * const routePoint = await prisma.routePoint.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RoutePointUpdateManyArgs>(args: SelectSubset<T, RoutePointUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one RoutePoint.
     * @param {RoutePointUpsertArgs} args - Arguments to update or create a RoutePoint.
     * @example
     * // Update or create a RoutePoint
     * const routePoint = await prisma.routePoint.upsert({
     *   create: {
     *     // ... data to create a RoutePoint
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RoutePoint we want to update
     *   }
     * })
     */
    upsert<T extends RoutePointUpsertArgs>(args: SelectSubset<T, RoutePointUpsertArgs<ExtArgs>>): Prisma__RoutePointClient<$Result.GetResult<Prisma.$RoutePointPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of RoutePoints.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoutePointCountArgs} args - Arguments to filter RoutePoints to count.
     * @example
     * // Count the number of RoutePoints
     * const count = await prisma.routePoint.count({
     *   where: {
     *     // ... the filter for the RoutePoints we want to count
     *   }
     * })
    **/
    count<T extends RoutePointCountArgs>(
      args?: Subset<T, RoutePointCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RoutePointCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RoutePoint.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoutePointAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RoutePointAggregateArgs>(args: Subset<T, RoutePointAggregateArgs>): Prisma.PrismaPromise<GetRoutePointAggregateType<T>>

    /**
     * Group by RoutePoint.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoutePointGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RoutePointGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RoutePointGroupByArgs['orderBy'] }
        : { orderBy?: RoutePointGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RoutePointGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRoutePointGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RoutePoint model
   */
  readonly fields: RoutePointFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RoutePoint.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RoutePointClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RoutePoint model
   */ 
  interface RoutePointFieldRefs {
    readonly id: FieldRef<"RoutePoint", 'String'>
    readonly orderIndex: FieldRef<"RoutePoint", 'Int'>
    readonly name: FieldRef<"RoutePoint", 'String'>
    readonly distanceKm: FieldRef<"RoutePoint", 'String'>
    readonly category: FieldRef<"RoutePoint", 'String'>
    readonly description: FieldRef<"RoutePoint", 'String'>
    readonly icon: FieldRef<"RoutePoint", 'String'>
    readonly image: FieldRef<"RoutePoint", 'String'>
    readonly isWaterStation: FieldRef<"RoutePoint", 'Boolean'>
    readonly isMedicalSpot: FieldRef<"RoutePoint", 'Boolean'>
    readonly createdAt: FieldRef<"RoutePoint", 'DateTime'>
    readonly updatedAt: FieldRef<"RoutePoint", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RoutePoint findUnique
   */
  export type RoutePointFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoutePoint
     */
    select?: RoutePointSelect<ExtArgs> | null
    /**
     * Filter, which RoutePoint to fetch.
     */
    where: RoutePointWhereUniqueInput
  }

  /**
   * RoutePoint findUniqueOrThrow
   */
  export type RoutePointFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoutePoint
     */
    select?: RoutePointSelect<ExtArgs> | null
    /**
     * Filter, which RoutePoint to fetch.
     */
    where: RoutePointWhereUniqueInput
  }

  /**
   * RoutePoint findFirst
   */
  export type RoutePointFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoutePoint
     */
    select?: RoutePointSelect<ExtArgs> | null
    /**
     * Filter, which RoutePoint to fetch.
     */
    where?: RoutePointWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoutePoints to fetch.
     */
    orderBy?: RoutePointOrderByWithRelationInput | RoutePointOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RoutePoints.
     */
    cursor?: RoutePointWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoutePoints from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoutePoints.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RoutePoints.
     */
    distinct?: RoutePointScalarFieldEnum | RoutePointScalarFieldEnum[]
  }

  /**
   * RoutePoint findFirstOrThrow
   */
  export type RoutePointFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoutePoint
     */
    select?: RoutePointSelect<ExtArgs> | null
    /**
     * Filter, which RoutePoint to fetch.
     */
    where?: RoutePointWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoutePoints to fetch.
     */
    orderBy?: RoutePointOrderByWithRelationInput | RoutePointOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RoutePoints.
     */
    cursor?: RoutePointWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoutePoints from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoutePoints.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RoutePoints.
     */
    distinct?: RoutePointScalarFieldEnum | RoutePointScalarFieldEnum[]
  }

  /**
   * RoutePoint findMany
   */
  export type RoutePointFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoutePoint
     */
    select?: RoutePointSelect<ExtArgs> | null
    /**
     * Filter, which RoutePoints to fetch.
     */
    where?: RoutePointWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoutePoints to fetch.
     */
    orderBy?: RoutePointOrderByWithRelationInput | RoutePointOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RoutePoints.
     */
    cursor?: RoutePointWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoutePoints from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoutePoints.
     */
    skip?: number
    distinct?: RoutePointScalarFieldEnum | RoutePointScalarFieldEnum[]
  }

  /**
   * RoutePoint create
   */
  export type RoutePointCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoutePoint
     */
    select?: RoutePointSelect<ExtArgs> | null
    /**
     * The data needed to create a RoutePoint.
     */
    data: XOR<RoutePointCreateInput, RoutePointUncheckedCreateInput>
  }

  /**
   * RoutePoint createMany
   */
  export type RoutePointCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RoutePoints.
     */
    data: RoutePointCreateManyInput | RoutePointCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RoutePoint createManyAndReturn
   */
  export type RoutePointCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoutePoint
     */
    select?: RoutePointSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many RoutePoints.
     */
    data: RoutePointCreateManyInput | RoutePointCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RoutePoint update
   */
  export type RoutePointUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoutePoint
     */
    select?: RoutePointSelect<ExtArgs> | null
    /**
     * The data needed to update a RoutePoint.
     */
    data: XOR<RoutePointUpdateInput, RoutePointUncheckedUpdateInput>
    /**
     * Choose, which RoutePoint to update.
     */
    where: RoutePointWhereUniqueInput
  }

  /**
   * RoutePoint updateMany
   */
  export type RoutePointUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RoutePoints.
     */
    data: XOR<RoutePointUpdateManyMutationInput, RoutePointUncheckedUpdateManyInput>
    /**
     * Filter which RoutePoints to update
     */
    where?: RoutePointWhereInput
  }

  /**
   * RoutePoint upsert
   */
  export type RoutePointUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoutePoint
     */
    select?: RoutePointSelect<ExtArgs> | null
    /**
     * The filter to search for the RoutePoint to update in case it exists.
     */
    where: RoutePointWhereUniqueInput
    /**
     * In case the RoutePoint found by the `where` argument doesn't exist, create a new RoutePoint with this data.
     */
    create: XOR<RoutePointCreateInput, RoutePointUncheckedCreateInput>
    /**
     * In case the RoutePoint was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RoutePointUpdateInput, RoutePointUncheckedUpdateInput>
  }

  /**
   * RoutePoint delete
   */
  export type RoutePointDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoutePoint
     */
    select?: RoutePointSelect<ExtArgs> | null
    /**
     * Filter which RoutePoint to delete.
     */
    where: RoutePointWhereUniqueInput
  }

  /**
   * RoutePoint deleteMany
   */
  export type RoutePointDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RoutePoints to delete
     */
    where?: RoutePointWhereInput
  }

  /**
   * RoutePoint without action
   */
  export type RoutePointDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoutePoint
     */
    select?: RoutePointSelect<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    fullName: 'fullName',
    email: 'email',
    phoneNumber: 'phoneNumber',
    createdAt: 'createdAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const EventScalarFieldEnum: {
    id: 'id',
    ticketName: 'ticketName',
    category: 'category',
    stock: 'stock',
    price: 'price',
    ticketImage: 'ticketImage',
    medalImage: 'medalImage',
    eventDate: 'eventDate',
    followGlobalTimer: 'followGlobalTimer',
    isClosed: 'isClosed',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type EventScalarFieldEnum = (typeof EventScalarFieldEnum)[keyof typeof EventScalarFieldEnum]


  export const EventBenefitScalarFieldEnum: {
    id: 'id',
    eventId: 'eventId',
    name: 'name',
    description: 'description',
    image: 'image'
  };

  export type EventBenefitScalarFieldEnum = (typeof EventBenefitScalarFieldEnum)[keyof typeof EventBenefitScalarFieldEnum]


  export const JerseyScalarFieldEnum: {
    id: 'id',
    eventId: 'eventId',
    name: 'name',
    type: 'type',
    sizes: 'sizes',
    image: 'image',
    bannerImages: 'bannerImages',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type JerseyScalarFieldEnum = (typeof JerseyScalarFieldEnum)[keyof typeof JerseyScalarFieldEnum]


  export const OrderScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    totalAmount: 'totalAmount',
    status: 'status',
    midtransOrderId: 'midtransOrderId',
    snapToken: 'snapToken',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type OrderScalarFieldEnum = (typeof OrderScalarFieldEnum)[keyof typeof OrderScalarFieldEnum]


  export const ParticipantScalarFieldEnum: {
    id: 'id',
    orderId: 'orderId',
    eventId: 'eventId',
    fullNameKtp: 'fullNameKtp',
    bibName: 'bibName',
    phoneNumber: 'phoneNumber',
    nik: 'nik',
    gender: 'gender',
    birthPlace: 'birthPlace',
    birthDate: 'birthDate',
    fullAddress: 'fullAddress',
    country: 'country',
    bloodType: 'bloodType',
    medicalHistory: 'medicalHistory',
    emergencyContactName: 'emergencyContactName',
    emergencyContactPhone: 'emergencyContactPhone',
    jerseyId: 'jerseyId',
    selectedSize: 'selectedSize',
    communityName: 'communityName',
    bibNumber: 'bibNumber',
    createdAt: 'createdAt'
  };

  export type ParticipantScalarFieldEnum = (typeof ParticipantScalarFieldEnum)[keyof typeof ParticipantScalarFieldEnum]


  export const QrTokenScalarFieldEnum: {
    token: 'token',
    participantId: 'participantId',
    orderId: 'orderId',
    createdAt: 'createdAt'
  };

  export type QrTokenScalarFieldEnum = (typeof QrTokenScalarFieldEnum)[keyof typeof QrTokenScalarFieldEnum]


  export const LogScalarFieldEnum: {
    id: 'id',
    action: 'action',
    description: 'description',
    userId: 'userId',
    adminId: 'adminId',
    entityType: 'entityType',
    entityId: 'entityId',
    metadata: 'metadata',
    createdAt: 'createdAt'
  };

  export type LogScalarFieldEnum = (typeof LogScalarFieldEnum)[keyof typeof LogScalarFieldEnum]


  export const BibConfigurationScalarFieldEnum: {
    id: 'id',
    eventId: 'eventId',
    prefix: 'prefix',
    digitLength: 'digitLength',
    startNumber: 'startNumber',
    suffix: 'suffix',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type BibConfigurationScalarFieldEnum = (typeof BibConfigurationScalarFieldEnum)[keyof typeof BibConfigurationScalarFieldEnum]


  export const RoleScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    permissions: 'permissions',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type RoleScalarFieldEnum = (typeof RoleScalarFieldEnum)[keyof typeof RoleScalarFieldEnum]


  export const AdminScalarFieldEnum: {
    id: 'id',
    username: 'username',
    email: 'email',
    password: 'password',
    fullName: 'fullName',
    roleId: 'roleId',
    isActive: 'isActive',
    tokenVersion: 'tokenVersion',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AdminScalarFieldEnum = (typeof AdminScalarFieldEnum)[keyof typeof AdminScalarFieldEnum]


  export const AppSettingScalarFieldEnum: {
    key: 'key',
    value: 'value',
    description: 'description',
    updatedAt: 'updatedAt'
  };

  export type AppSettingScalarFieldEnum = (typeof AppSettingScalarFieldEnum)[keyof typeof AppSettingScalarFieldEnum]


  export const RoutePointScalarFieldEnum: {
    id: 'id',
    orderIndex: 'orderIndex',
    name: 'name',
    distanceKm: 'distanceKm',
    category: 'category',
    description: 'description',
    icon: 'icon',
    image: 'image',
    isWaterStation: 'isWaterStation',
    isMedicalSpot: 'isMedicalSpot',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type RoutePointScalarFieldEnum = (typeof RoutePointScalarFieldEnum)[keyof typeof RoutePointScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'OrderStatus'
   */
  export type EnumOrderStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OrderStatus'>
    


  /**
   * Reference to a field of type 'OrderStatus[]'
   */
  export type ListEnumOrderStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OrderStatus[]'>
    


  /**
   * Reference to a field of type 'Gender'
   */
  export type EnumGenderFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Gender'>
    


  /**
   * Reference to a field of type 'Gender[]'
   */
  export type ListEnumGenderFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Gender[]'>
    


  /**
   * Reference to a field of type 'BloodType'
   */
  export type EnumBloodTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BloodType'>
    


  /**
   * Reference to a field of type 'BloodType[]'
   */
  export type ListEnumBloodTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BloodType[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    fullName?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    phoneNumber?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    orders?: OrderListRelationFilter
    logs?: LogListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    fullName?: SortOrder
    email?: SortOrder
    phoneNumber?: SortOrder
    createdAt?: SortOrder
    orders?: OrderOrderByRelationAggregateInput
    logs?: LogOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    fullName?: StringFilter<"User"> | string
    phoneNumber?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    orders?: OrderListRelationFilter
    logs?: LogListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    fullName?: SortOrder
    email?: SortOrder
    phoneNumber?: SortOrder
    createdAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    fullName?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    phoneNumber?: StringWithAggregatesFilter<"User"> | string
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type EventWhereInput = {
    AND?: EventWhereInput | EventWhereInput[]
    OR?: EventWhereInput[]
    NOT?: EventWhereInput | EventWhereInput[]
    id?: StringFilter<"Event"> | string
    ticketName?: StringFilter<"Event"> | string
    category?: StringFilter<"Event"> | string
    stock?: IntFilter<"Event"> | number
    price?: DecimalFilter<"Event"> | Decimal | DecimalJsLike | number | string
    ticketImage?: StringNullableFilter<"Event"> | string | null
    medalImage?: StringNullableFilter<"Event"> | string | null
    eventDate?: DateTimeNullableFilter<"Event"> | Date | string | null
    followGlobalTimer?: BoolFilter<"Event"> | boolean
    isClosed?: BoolFilter<"Event"> | boolean
    createdAt?: DateTimeFilter<"Event"> | Date | string
    updatedAt?: DateTimeFilter<"Event"> | Date | string
    participants?: ParticipantListRelationFilter
    benefits?: EventBenefitListRelationFilter
    jerseys?: JerseyListRelationFilter
    bibConfig?: XOR<BibConfigurationNullableRelationFilter, BibConfigurationWhereInput> | null
  }

  export type EventOrderByWithRelationInput = {
    id?: SortOrder
    ticketName?: SortOrder
    category?: SortOrder
    stock?: SortOrder
    price?: SortOrder
    ticketImage?: SortOrderInput | SortOrder
    medalImage?: SortOrderInput | SortOrder
    eventDate?: SortOrderInput | SortOrder
    followGlobalTimer?: SortOrder
    isClosed?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    participants?: ParticipantOrderByRelationAggregateInput
    benefits?: EventBenefitOrderByRelationAggregateInput
    jerseys?: JerseyOrderByRelationAggregateInput
    bibConfig?: BibConfigurationOrderByWithRelationInput
  }

  export type EventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: EventWhereInput | EventWhereInput[]
    OR?: EventWhereInput[]
    NOT?: EventWhereInput | EventWhereInput[]
    ticketName?: StringFilter<"Event"> | string
    category?: StringFilter<"Event"> | string
    stock?: IntFilter<"Event"> | number
    price?: DecimalFilter<"Event"> | Decimal | DecimalJsLike | number | string
    ticketImage?: StringNullableFilter<"Event"> | string | null
    medalImage?: StringNullableFilter<"Event"> | string | null
    eventDate?: DateTimeNullableFilter<"Event"> | Date | string | null
    followGlobalTimer?: BoolFilter<"Event"> | boolean
    isClosed?: BoolFilter<"Event"> | boolean
    createdAt?: DateTimeFilter<"Event"> | Date | string
    updatedAt?: DateTimeFilter<"Event"> | Date | string
    participants?: ParticipantListRelationFilter
    benefits?: EventBenefitListRelationFilter
    jerseys?: JerseyListRelationFilter
    bibConfig?: XOR<BibConfigurationNullableRelationFilter, BibConfigurationWhereInput> | null
  }, "id">

  export type EventOrderByWithAggregationInput = {
    id?: SortOrder
    ticketName?: SortOrder
    category?: SortOrder
    stock?: SortOrder
    price?: SortOrder
    ticketImage?: SortOrderInput | SortOrder
    medalImage?: SortOrderInput | SortOrder
    eventDate?: SortOrderInput | SortOrder
    followGlobalTimer?: SortOrder
    isClosed?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: EventCountOrderByAggregateInput
    _avg?: EventAvgOrderByAggregateInput
    _max?: EventMaxOrderByAggregateInput
    _min?: EventMinOrderByAggregateInput
    _sum?: EventSumOrderByAggregateInput
  }

  export type EventScalarWhereWithAggregatesInput = {
    AND?: EventScalarWhereWithAggregatesInput | EventScalarWhereWithAggregatesInput[]
    OR?: EventScalarWhereWithAggregatesInput[]
    NOT?: EventScalarWhereWithAggregatesInput | EventScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Event"> | string
    ticketName?: StringWithAggregatesFilter<"Event"> | string
    category?: StringWithAggregatesFilter<"Event"> | string
    stock?: IntWithAggregatesFilter<"Event"> | number
    price?: DecimalWithAggregatesFilter<"Event"> | Decimal | DecimalJsLike | number | string
    ticketImage?: StringNullableWithAggregatesFilter<"Event"> | string | null
    medalImage?: StringNullableWithAggregatesFilter<"Event"> | string | null
    eventDate?: DateTimeNullableWithAggregatesFilter<"Event"> | Date | string | null
    followGlobalTimer?: BoolWithAggregatesFilter<"Event"> | boolean
    isClosed?: BoolWithAggregatesFilter<"Event"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Event"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Event"> | Date | string
  }

  export type EventBenefitWhereInput = {
    AND?: EventBenefitWhereInput | EventBenefitWhereInput[]
    OR?: EventBenefitWhereInput[]
    NOT?: EventBenefitWhereInput | EventBenefitWhereInput[]
    id?: StringFilter<"EventBenefit"> | string
    eventId?: StringFilter<"EventBenefit"> | string
    name?: StringFilter<"EventBenefit"> | string
    description?: StringFilter<"EventBenefit"> | string
    image?: StringNullableFilter<"EventBenefit"> | string | null
    event?: XOR<EventRelationFilter, EventWhereInput>
  }

  export type EventBenefitOrderByWithRelationInput = {
    id?: SortOrder
    eventId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    image?: SortOrderInput | SortOrder
    event?: EventOrderByWithRelationInput
  }

  export type EventBenefitWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: EventBenefitWhereInput | EventBenefitWhereInput[]
    OR?: EventBenefitWhereInput[]
    NOT?: EventBenefitWhereInput | EventBenefitWhereInput[]
    eventId?: StringFilter<"EventBenefit"> | string
    name?: StringFilter<"EventBenefit"> | string
    description?: StringFilter<"EventBenefit"> | string
    image?: StringNullableFilter<"EventBenefit"> | string | null
    event?: XOR<EventRelationFilter, EventWhereInput>
  }, "id">

  export type EventBenefitOrderByWithAggregationInput = {
    id?: SortOrder
    eventId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    image?: SortOrderInput | SortOrder
    _count?: EventBenefitCountOrderByAggregateInput
    _max?: EventBenefitMaxOrderByAggregateInput
    _min?: EventBenefitMinOrderByAggregateInput
  }

  export type EventBenefitScalarWhereWithAggregatesInput = {
    AND?: EventBenefitScalarWhereWithAggregatesInput | EventBenefitScalarWhereWithAggregatesInput[]
    OR?: EventBenefitScalarWhereWithAggregatesInput[]
    NOT?: EventBenefitScalarWhereWithAggregatesInput | EventBenefitScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"EventBenefit"> | string
    eventId?: StringWithAggregatesFilter<"EventBenefit"> | string
    name?: StringWithAggregatesFilter<"EventBenefit"> | string
    description?: StringWithAggregatesFilter<"EventBenefit"> | string
    image?: StringNullableWithAggregatesFilter<"EventBenefit"> | string | null
  }

  export type JerseyWhereInput = {
    AND?: JerseyWhereInput | JerseyWhereInput[]
    OR?: JerseyWhereInput[]
    NOT?: JerseyWhereInput | JerseyWhereInput[]
    id?: StringFilter<"Jersey"> | string
    eventId?: StringFilter<"Jersey"> | string
    name?: StringFilter<"Jersey"> | string
    type?: StringFilter<"Jersey"> | string
    sizes?: JsonFilter<"Jersey">
    image?: StringNullableFilter<"Jersey"> | string | null
    bannerImages?: JsonNullableFilter<"Jersey">
    createdAt?: DateTimeFilter<"Jersey"> | Date | string
    updatedAt?: DateTimeFilter<"Jersey"> | Date | string
    event?: XOR<EventRelationFilter, EventWhereInput>
    participants?: ParticipantListRelationFilter
  }

  export type JerseyOrderByWithRelationInput = {
    id?: SortOrder
    eventId?: SortOrder
    name?: SortOrder
    type?: SortOrder
    sizes?: SortOrder
    image?: SortOrderInput | SortOrder
    bannerImages?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    event?: EventOrderByWithRelationInput
    participants?: ParticipantOrderByRelationAggregateInput
  }

  export type JerseyWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: JerseyWhereInput | JerseyWhereInput[]
    OR?: JerseyWhereInput[]
    NOT?: JerseyWhereInput | JerseyWhereInput[]
    eventId?: StringFilter<"Jersey"> | string
    name?: StringFilter<"Jersey"> | string
    type?: StringFilter<"Jersey"> | string
    sizes?: JsonFilter<"Jersey">
    image?: StringNullableFilter<"Jersey"> | string | null
    bannerImages?: JsonNullableFilter<"Jersey">
    createdAt?: DateTimeFilter<"Jersey"> | Date | string
    updatedAt?: DateTimeFilter<"Jersey"> | Date | string
    event?: XOR<EventRelationFilter, EventWhereInput>
    participants?: ParticipantListRelationFilter
  }, "id">

  export type JerseyOrderByWithAggregationInput = {
    id?: SortOrder
    eventId?: SortOrder
    name?: SortOrder
    type?: SortOrder
    sizes?: SortOrder
    image?: SortOrderInput | SortOrder
    bannerImages?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: JerseyCountOrderByAggregateInput
    _max?: JerseyMaxOrderByAggregateInput
    _min?: JerseyMinOrderByAggregateInput
  }

  export type JerseyScalarWhereWithAggregatesInput = {
    AND?: JerseyScalarWhereWithAggregatesInput | JerseyScalarWhereWithAggregatesInput[]
    OR?: JerseyScalarWhereWithAggregatesInput[]
    NOT?: JerseyScalarWhereWithAggregatesInput | JerseyScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Jersey"> | string
    eventId?: StringWithAggregatesFilter<"Jersey"> | string
    name?: StringWithAggregatesFilter<"Jersey"> | string
    type?: StringWithAggregatesFilter<"Jersey"> | string
    sizes?: JsonWithAggregatesFilter<"Jersey">
    image?: StringNullableWithAggregatesFilter<"Jersey"> | string | null
    bannerImages?: JsonNullableWithAggregatesFilter<"Jersey">
    createdAt?: DateTimeWithAggregatesFilter<"Jersey"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Jersey"> | Date | string
  }

  export type OrderWhereInput = {
    AND?: OrderWhereInput | OrderWhereInput[]
    OR?: OrderWhereInput[]
    NOT?: OrderWhereInput | OrderWhereInput[]
    id?: StringFilter<"Order"> | string
    userId?: StringFilter<"Order"> | string
    totalAmount?: DecimalFilter<"Order"> | Decimal | DecimalJsLike | number | string
    status?: EnumOrderStatusFilter<"Order"> | $Enums.OrderStatus
    midtransOrderId?: StringNullableFilter<"Order"> | string | null
    snapToken?: StringNullableFilter<"Order"> | string | null
    createdAt?: DateTimeFilter<"Order"> | Date | string
    updatedAt?: DateTimeFilter<"Order"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    participants?: ParticipantListRelationFilter
    masterQrToken?: XOR<QrTokenNullableRelationFilter, QrTokenWhereInput> | null
  }

  export type OrderOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    totalAmount?: SortOrder
    status?: SortOrder
    midtransOrderId?: SortOrderInput | SortOrder
    snapToken?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    participants?: ParticipantOrderByRelationAggregateInput
    masterQrToken?: QrTokenOrderByWithRelationInput
  }

  export type OrderWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    midtransOrderId?: string
    AND?: OrderWhereInput | OrderWhereInput[]
    OR?: OrderWhereInput[]
    NOT?: OrderWhereInput | OrderWhereInput[]
    userId?: StringFilter<"Order"> | string
    totalAmount?: DecimalFilter<"Order"> | Decimal | DecimalJsLike | number | string
    status?: EnumOrderStatusFilter<"Order"> | $Enums.OrderStatus
    snapToken?: StringNullableFilter<"Order"> | string | null
    createdAt?: DateTimeFilter<"Order"> | Date | string
    updatedAt?: DateTimeFilter<"Order"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    participants?: ParticipantListRelationFilter
    masterQrToken?: XOR<QrTokenNullableRelationFilter, QrTokenWhereInput> | null
  }, "id" | "midtransOrderId">

  export type OrderOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    totalAmount?: SortOrder
    status?: SortOrder
    midtransOrderId?: SortOrderInput | SortOrder
    snapToken?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: OrderCountOrderByAggregateInput
    _avg?: OrderAvgOrderByAggregateInput
    _max?: OrderMaxOrderByAggregateInput
    _min?: OrderMinOrderByAggregateInput
    _sum?: OrderSumOrderByAggregateInput
  }

  export type OrderScalarWhereWithAggregatesInput = {
    AND?: OrderScalarWhereWithAggregatesInput | OrderScalarWhereWithAggregatesInput[]
    OR?: OrderScalarWhereWithAggregatesInput[]
    NOT?: OrderScalarWhereWithAggregatesInput | OrderScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Order"> | string
    userId?: StringWithAggregatesFilter<"Order"> | string
    totalAmount?: DecimalWithAggregatesFilter<"Order"> | Decimal | DecimalJsLike | number | string
    status?: EnumOrderStatusWithAggregatesFilter<"Order"> | $Enums.OrderStatus
    midtransOrderId?: StringNullableWithAggregatesFilter<"Order"> | string | null
    snapToken?: StringNullableWithAggregatesFilter<"Order"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Order"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Order"> | Date | string
  }

  export type ParticipantWhereInput = {
    AND?: ParticipantWhereInput | ParticipantWhereInput[]
    OR?: ParticipantWhereInput[]
    NOT?: ParticipantWhereInput | ParticipantWhereInput[]
    id?: StringFilter<"Participant"> | string
    orderId?: StringFilter<"Participant"> | string
    eventId?: StringFilter<"Participant"> | string
    fullNameKtp?: StringFilter<"Participant"> | string
    bibName?: StringFilter<"Participant"> | string
    phoneNumber?: StringNullableFilter<"Participant"> | string | null
    nik?: StringFilter<"Participant"> | string
    gender?: EnumGenderFilter<"Participant"> | $Enums.Gender
    birthPlace?: StringFilter<"Participant"> | string
    birthDate?: DateTimeFilter<"Participant"> | Date | string
    fullAddress?: StringFilter<"Participant"> | string
    country?: StringFilter<"Participant"> | string
    bloodType?: EnumBloodTypeFilter<"Participant"> | $Enums.BloodType
    medicalHistory?: StringNullableFilter<"Participant"> | string | null
    emergencyContactName?: StringFilter<"Participant"> | string
    emergencyContactPhone?: StringFilter<"Participant"> | string
    jerseyId?: StringNullableFilter<"Participant"> | string | null
    selectedSize?: StringNullableFilter<"Participant"> | string | null
    communityName?: StringNullableFilter<"Participant"> | string | null
    bibNumber?: StringNullableFilter<"Participant"> | string | null
    createdAt?: DateTimeFilter<"Participant"> | Date | string
    order?: XOR<OrderRelationFilter, OrderWhereInput>
    event?: XOR<EventRelationFilter, EventWhereInput>
    jersey?: XOR<JerseyNullableRelationFilter, JerseyWhereInput> | null
    qrToken?: XOR<QrTokenNullableRelationFilter, QrTokenWhereInput> | null
  }

  export type ParticipantOrderByWithRelationInput = {
    id?: SortOrder
    orderId?: SortOrder
    eventId?: SortOrder
    fullNameKtp?: SortOrder
    bibName?: SortOrder
    phoneNumber?: SortOrderInput | SortOrder
    nik?: SortOrder
    gender?: SortOrder
    birthPlace?: SortOrder
    birthDate?: SortOrder
    fullAddress?: SortOrder
    country?: SortOrder
    bloodType?: SortOrder
    medicalHistory?: SortOrderInput | SortOrder
    emergencyContactName?: SortOrder
    emergencyContactPhone?: SortOrder
    jerseyId?: SortOrderInput | SortOrder
    selectedSize?: SortOrderInput | SortOrder
    communityName?: SortOrderInput | SortOrder
    bibNumber?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    order?: OrderOrderByWithRelationInput
    event?: EventOrderByWithRelationInput
    jersey?: JerseyOrderByWithRelationInput
    qrToken?: QrTokenOrderByWithRelationInput
  }

  export type ParticipantWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    bibNumber?: string
    AND?: ParticipantWhereInput | ParticipantWhereInput[]
    OR?: ParticipantWhereInput[]
    NOT?: ParticipantWhereInput | ParticipantWhereInput[]
    orderId?: StringFilter<"Participant"> | string
    eventId?: StringFilter<"Participant"> | string
    fullNameKtp?: StringFilter<"Participant"> | string
    bibName?: StringFilter<"Participant"> | string
    phoneNumber?: StringNullableFilter<"Participant"> | string | null
    nik?: StringFilter<"Participant"> | string
    gender?: EnumGenderFilter<"Participant"> | $Enums.Gender
    birthPlace?: StringFilter<"Participant"> | string
    birthDate?: DateTimeFilter<"Participant"> | Date | string
    fullAddress?: StringFilter<"Participant"> | string
    country?: StringFilter<"Participant"> | string
    bloodType?: EnumBloodTypeFilter<"Participant"> | $Enums.BloodType
    medicalHistory?: StringNullableFilter<"Participant"> | string | null
    emergencyContactName?: StringFilter<"Participant"> | string
    emergencyContactPhone?: StringFilter<"Participant"> | string
    jerseyId?: StringNullableFilter<"Participant"> | string | null
    selectedSize?: StringNullableFilter<"Participant"> | string | null
    communityName?: StringNullableFilter<"Participant"> | string | null
    createdAt?: DateTimeFilter<"Participant"> | Date | string
    order?: XOR<OrderRelationFilter, OrderWhereInput>
    event?: XOR<EventRelationFilter, EventWhereInput>
    jersey?: XOR<JerseyNullableRelationFilter, JerseyWhereInput> | null
    qrToken?: XOR<QrTokenNullableRelationFilter, QrTokenWhereInput> | null
  }, "id" | "bibNumber">

  export type ParticipantOrderByWithAggregationInput = {
    id?: SortOrder
    orderId?: SortOrder
    eventId?: SortOrder
    fullNameKtp?: SortOrder
    bibName?: SortOrder
    phoneNumber?: SortOrderInput | SortOrder
    nik?: SortOrder
    gender?: SortOrder
    birthPlace?: SortOrder
    birthDate?: SortOrder
    fullAddress?: SortOrder
    country?: SortOrder
    bloodType?: SortOrder
    medicalHistory?: SortOrderInput | SortOrder
    emergencyContactName?: SortOrder
    emergencyContactPhone?: SortOrder
    jerseyId?: SortOrderInput | SortOrder
    selectedSize?: SortOrderInput | SortOrder
    communityName?: SortOrderInput | SortOrder
    bibNumber?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: ParticipantCountOrderByAggregateInput
    _max?: ParticipantMaxOrderByAggregateInput
    _min?: ParticipantMinOrderByAggregateInput
  }

  export type ParticipantScalarWhereWithAggregatesInput = {
    AND?: ParticipantScalarWhereWithAggregatesInput | ParticipantScalarWhereWithAggregatesInput[]
    OR?: ParticipantScalarWhereWithAggregatesInput[]
    NOT?: ParticipantScalarWhereWithAggregatesInput | ParticipantScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Participant"> | string
    orderId?: StringWithAggregatesFilter<"Participant"> | string
    eventId?: StringWithAggregatesFilter<"Participant"> | string
    fullNameKtp?: StringWithAggregatesFilter<"Participant"> | string
    bibName?: StringWithAggregatesFilter<"Participant"> | string
    phoneNumber?: StringNullableWithAggregatesFilter<"Participant"> | string | null
    nik?: StringWithAggregatesFilter<"Participant"> | string
    gender?: EnumGenderWithAggregatesFilter<"Participant"> | $Enums.Gender
    birthPlace?: StringWithAggregatesFilter<"Participant"> | string
    birthDate?: DateTimeWithAggregatesFilter<"Participant"> | Date | string
    fullAddress?: StringWithAggregatesFilter<"Participant"> | string
    country?: StringWithAggregatesFilter<"Participant"> | string
    bloodType?: EnumBloodTypeWithAggregatesFilter<"Participant"> | $Enums.BloodType
    medicalHistory?: StringNullableWithAggregatesFilter<"Participant"> | string | null
    emergencyContactName?: StringWithAggregatesFilter<"Participant"> | string
    emergencyContactPhone?: StringWithAggregatesFilter<"Participant"> | string
    jerseyId?: StringNullableWithAggregatesFilter<"Participant"> | string | null
    selectedSize?: StringNullableWithAggregatesFilter<"Participant"> | string | null
    communityName?: StringNullableWithAggregatesFilter<"Participant"> | string | null
    bibNumber?: StringNullableWithAggregatesFilter<"Participant"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Participant"> | Date | string
  }

  export type QrTokenWhereInput = {
    AND?: QrTokenWhereInput | QrTokenWhereInput[]
    OR?: QrTokenWhereInput[]
    NOT?: QrTokenWhereInput | QrTokenWhereInput[]
    token?: StringFilter<"QrToken"> | string
    participantId?: StringNullableFilter<"QrToken"> | string | null
    orderId?: StringNullableFilter<"QrToken"> | string | null
    createdAt?: DateTimeFilter<"QrToken"> | Date | string
    participant?: XOR<ParticipantNullableRelationFilter, ParticipantWhereInput> | null
    order?: XOR<OrderNullableRelationFilter, OrderWhereInput> | null
  }

  export type QrTokenOrderByWithRelationInput = {
    token?: SortOrder
    participantId?: SortOrderInput | SortOrder
    orderId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    participant?: ParticipantOrderByWithRelationInput
    order?: OrderOrderByWithRelationInput
  }

  export type QrTokenWhereUniqueInput = Prisma.AtLeast<{
    token?: string
    participantId?: string
    orderId?: string
    AND?: QrTokenWhereInput | QrTokenWhereInput[]
    OR?: QrTokenWhereInput[]
    NOT?: QrTokenWhereInput | QrTokenWhereInput[]
    createdAt?: DateTimeFilter<"QrToken"> | Date | string
    participant?: XOR<ParticipantNullableRelationFilter, ParticipantWhereInput> | null
    order?: XOR<OrderNullableRelationFilter, OrderWhereInput> | null
  }, "token" | "participantId" | "orderId">

  export type QrTokenOrderByWithAggregationInput = {
    token?: SortOrder
    participantId?: SortOrderInput | SortOrder
    orderId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: QrTokenCountOrderByAggregateInput
    _max?: QrTokenMaxOrderByAggregateInput
    _min?: QrTokenMinOrderByAggregateInput
  }

  export type QrTokenScalarWhereWithAggregatesInput = {
    AND?: QrTokenScalarWhereWithAggregatesInput | QrTokenScalarWhereWithAggregatesInput[]
    OR?: QrTokenScalarWhereWithAggregatesInput[]
    NOT?: QrTokenScalarWhereWithAggregatesInput | QrTokenScalarWhereWithAggregatesInput[]
    token?: StringWithAggregatesFilter<"QrToken"> | string
    participantId?: StringNullableWithAggregatesFilter<"QrToken"> | string | null
    orderId?: StringNullableWithAggregatesFilter<"QrToken"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"QrToken"> | Date | string
  }

  export type LogWhereInput = {
    AND?: LogWhereInput | LogWhereInput[]
    OR?: LogWhereInput[]
    NOT?: LogWhereInput | LogWhereInput[]
    id?: StringFilter<"Log"> | string
    action?: StringFilter<"Log"> | string
    description?: StringFilter<"Log"> | string
    userId?: StringNullableFilter<"Log"> | string | null
    adminId?: StringNullableFilter<"Log"> | string | null
    entityType?: StringNullableFilter<"Log"> | string | null
    entityId?: StringNullableFilter<"Log"> | string | null
    metadata?: JsonNullableFilter<"Log">
    createdAt?: DateTimeFilter<"Log"> | Date | string
    user?: XOR<UserNullableRelationFilter, UserWhereInput> | null
    admin?: XOR<AdminNullableRelationFilter, AdminWhereInput> | null
  }

  export type LogOrderByWithRelationInput = {
    id?: SortOrder
    action?: SortOrder
    description?: SortOrder
    userId?: SortOrderInput | SortOrder
    adminId?: SortOrderInput | SortOrder
    entityType?: SortOrderInput | SortOrder
    entityId?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
    admin?: AdminOrderByWithRelationInput
  }

  export type LogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LogWhereInput | LogWhereInput[]
    OR?: LogWhereInput[]
    NOT?: LogWhereInput | LogWhereInput[]
    action?: StringFilter<"Log"> | string
    description?: StringFilter<"Log"> | string
    userId?: StringNullableFilter<"Log"> | string | null
    adminId?: StringNullableFilter<"Log"> | string | null
    entityType?: StringNullableFilter<"Log"> | string | null
    entityId?: StringNullableFilter<"Log"> | string | null
    metadata?: JsonNullableFilter<"Log">
    createdAt?: DateTimeFilter<"Log"> | Date | string
    user?: XOR<UserNullableRelationFilter, UserWhereInput> | null
    admin?: XOR<AdminNullableRelationFilter, AdminWhereInput> | null
  }, "id">

  export type LogOrderByWithAggregationInput = {
    id?: SortOrder
    action?: SortOrder
    description?: SortOrder
    userId?: SortOrderInput | SortOrder
    adminId?: SortOrderInput | SortOrder
    entityType?: SortOrderInput | SortOrder
    entityId?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: LogCountOrderByAggregateInput
    _max?: LogMaxOrderByAggregateInput
    _min?: LogMinOrderByAggregateInput
  }

  export type LogScalarWhereWithAggregatesInput = {
    AND?: LogScalarWhereWithAggregatesInput | LogScalarWhereWithAggregatesInput[]
    OR?: LogScalarWhereWithAggregatesInput[]
    NOT?: LogScalarWhereWithAggregatesInput | LogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Log"> | string
    action?: StringWithAggregatesFilter<"Log"> | string
    description?: StringWithAggregatesFilter<"Log"> | string
    userId?: StringNullableWithAggregatesFilter<"Log"> | string | null
    adminId?: StringNullableWithAggregatesFilter<"Log"> | string | null
    entityType?: StringNullableWithAggregatesFilter<"Log"> | string | null
    entityId?: StringNullableWithAggregatesFilter<"Log"> | string | null
    metadata?: JsonNullableWithAggregatesFilter<"Log">
    createdAt?: DateTimeWithAggregatesFilter<"Log"> | Date | string
  }

  export type BibConfigurationWhereInput = {
    AND?: BibConfigurationWhereInput | BibConfigurationWhereInput[]
    OR?: BibConfigurationWhereInput[]
    NOT?: BibConfigurationWhereInput | BibConfigurationWhereInput[]
    id?: StringFilter<"BibConfiguration"> | string
    eventId?: StringFilter<"BibConfiguration"> | string
    prefix?: StringFilter<"BibConfiguration"> | string
    digitLength?: IntFilter<"BibConfiguration"> | number
    startNumber?: IntFilter<"BibConfiguration"> | number
    suffix?: StringNullableFilter<"BibConfiguration"> | string | null
    createdAt?: DateTimeFilter<"BibConfiguration"> | Date | string
    updatedAt?: DateTimeFilter<"BibConfiguration"> | Date | string
    event?: XOR<EventRelationFilter, EventWhereInput>
  }

  export type BibConfigurationOrderByWithRelationInput = {
    id?: SortOrder
    eventId?: SortOrder
    prefix?: SortOrder
    digitLength?: SortOrder
    startNumber?: SortOrder
    suffix?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    event?: EventOrderByWithRelationInput
  }

  export type BibConfigurationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    eventId?: string
    AND?: BibConfigurationWhereInput | BibConfigurationWhereInput[]
    OR?: BibConfigurationWhereInput[]
    NOT?: BibConfigurationWhereInput | BibConfigurationWhereInput[]
    prefix?: StringFilter<"BibConfiguration"> | string
    digitLength?: IntFilter<"BibConfiguration"> | number
    startNumber?: IntFilter<"BibConfiguration"> | number
    suffix?: StringNullableFilter<"BibConfiguration"> | string | null
    createdAt?: DateTimeFilter<"BibConfiguration"> | Date | string
    updatedAt?: DateTimeFilter<"BibConfiguration"> | Date | string
    event?: XOR<EventRelationFilter, EventWhereInput>
  }, "id" | "eventId">

  export type BibConfigurationOrderByWithAggregationInput = {
    id?: SortOrder
    eventId?: SortOrder
    prefix?: SortOrder
    digitLength?: SortOrder
    startNumber?: SortOrder
    suffix?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: BibConfigurationCountOrderByAggregateInput
    _avg?: BibConfigurationAvgOrderByAggregateInput
    _max?: BibConfigurationMaxOrderByAggregateInput
    _min?: BibConfigurationMinOrderByAggregateInput
    _sum?: BibConfigurationSumOrderByAggregateInput
  }

  export type BibConfigurationScalarWhereWithAggregatesInput = {
    AND?: BibConfigurationScalarWhereWithAggregatesInput | BibConfigurationScalarWhereWithAggregatesInput[]
    OR?: BibConfigurationScalarWhereWithAggregatesInput[]
    NOT?: BibConfigurationScalarWhereWithAggregatesInput | BibConfigurationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"BibConfiguration"> | string
    eventId?: StringWithAggregatesFilter<"BibConfiguration"> | string
    prefix?: StringWithAggregatesFilter<"BibConfiguration"> | string
    digitLength?: IntWithAggregatesFilter<"BibConfiguration"> | number
    startNumber?: IntWithAggregatesFilter<"BibConfiguration"> | number
    suffix?: StringNullableWithAggregatesFilter<"BibConfiguration"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"BibConfiguration"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"BibConfiguration"> | Date | string
  }

  export type RoleWhereInput = {
    AND?: RoleWhereInput | RoleWhereInput[]
    OR?: RoleWhereInput[]
    NOT?: RoleWhereInput | RoleWhereInput[]
    id?: StringFilter<"Role"> | string
    name?: StringFilter<"Role"> | string
    description?: StringNullableFilter<"Role"> | string | null
    permissions?: JsonFilter<"Role">
    createdAt?: DateTimeFilter<"Role"> | Date | string
    updatedAt?: DateTimeFilter<"Role"> | Date | string
    admins?: AdminListRelationFilter
  }

  export type RoleOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    permissions?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    admins?: AdminOrderByRelationAggregateInput
  }

  export type RoleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: RoleWhereInput | RoleWhereInput[]
    OR?: RoleWhereInput[]
    NOT?: RoleWhereInput | RoleWhereInput[]
    description?: StringNullableFilter<"Role"> | string | null
    permissions?: JsonFilter<"Role">
    createdAt?: DateTimeFilter<"Role"> | Date | string
    updatedAt?: DateTimeFilter<"Role"> | Date | string
    admins?: AdminListRelationFilter
  }, "id" | "name">

  export type RoleOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    permissions?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: RoleCountOrderByAggregateInput
    _max?: RoleMaxOrderByAggregateInput
    _min?: RoleMinOrderByAggregateInput
  }

  export type RoleScalarWhereWithAggregatesInput = {
    AND?: RoleScalarWhereWithAggregatesInput | RoleScalarWhereWithAggregatesInput[]
    OR?: RoleScalarWhereWithAggregatesInput[]
    NOT?: RoleScalarWhereWithAggregatesInput | RoleScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Role"> | string
    name?: StringWithAggregatesFilter<"Role"> | string
    description?: StringNullableWithAggregatesFilter<"Role"> | string | null
    permissions?: JsonWithAggregatesFilter<"Role">
    createdAt?: DateTimeWithAggregatesFilter<"Role"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Role"> | Date | string
  }

  export type AdminWhereInput = {
    AND?: AdminWhereInput | AdminWhereInput[]
    OR?: AdminWhereInput[]
    NOT?: AdminWhereInput | AdminWhereInput[]
    id?: StringFilter<"Admin"> | string
    username?: StringFilter<"Admin"> | string
    email?: StringFilter<"Admin"> | string
    password?: StringFilter<"Admin"> | string
    fullName?: StringFilter<"Admin"> | string
    roleId?: StringFilter<"Admin"> | string
    isActive?: BoolFilter<"Admin"> | boolean
    tokenVersion?: IntFilter<"Admin"> | number
    createdAt?: DateTimeFilter<"Admin"> | Date | string
    updatedAt?: DateTimeFilter<"Admin"> | Date | string
    role?: XOR<RoleRelationFilter, RoleWhereInput>
    logs?: LogListRelationFilter
  }

  export type AdminOrderByWithRelationInput = {
    id?: SortOrder
    username?: SortOrder
    email?: SortOrder
    password?: SortOrder
    fullName?: SortOrder
    roleId?: SortOrder
    isActive?: SortOrder
    tokenVersion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    role?: RoleOrderByWithRelationInput
    logs?: LogOrderByRelationAggregateInput
  }

  export type AdminWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    username?: string
    email?: string
    AND?: AdminWhereInput | AdminWhereInput[]
    OR?: AdminWhereInput[]
    NOT?: AdminWhereInput | AdminWhereInput[]
    password?: StringFilter<"Admin"> | string
    fullName?: StringFilter<"Admin"> | string
    roleId?: StringFilter<"Admin"> | string
    isActive?: BoolFilter<"Admin"> | boolean
    tokenVersion?: IntFilter<"Admin"> | number
    createdAt?: DateTimeFilter<"Admin"> | Date | string
    updatedAt?: DateTimeFilter<"Admin"> | Date | string
    role?: XOR<RoleRelationFilter, RoleWhereInput>
    logs?: LogListRelationFilter
  }, "id" | "username" | "email">

  export type AdminOrderByWithAggregationInput = {
    id?: SortOrder
    username?: SortOrder
    email?: SortOrder
    password?: SortOrder
    fullName?: SortOrder
    roleId?: SortOrder
    isActive?: SortOrder
    tokenVersion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AdminCountOrderByAggregateInput
    _avg?: AdminAvgOrderByAggregateInput
    _max?: AdminMaxOrderByAggregateInput
    _min?: AdminMinOrderByAggregateInput
    _sum?: AdminSumOrderByAggregateInput
  }

  export type AdminScalarWhereWithAggregatesInput = {
    AND?: AdminScalarWhereWithAggregatesInput | AdminScalarWhereWithAggregatesInput[]
    OR?: AdminScalarWhereWithAggregatesInput[]
    NOT?: AdminScalarWhereWithAggregatesInput | AdminScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Admin"> | string
    username?: StringWithAggregatesFilter<"Admin"> | string
    email?: StringWithAggregatesFilter<"Admin"> | string
    password?: StringWithAggregatesFilter<"Admin"> | string
    fullName?: StringWithAggregatesFilter<"Admin"> | string
    roleId?: StringWithAggregatesFilter<"Admin"> | string
    isActive?: BoolWithAggregatesFilter<"Admin"> | boolean
    tokenVersion?: IntWithAggregatesFilter<"Admin"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Admin"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Admin"> | Date | string
  }

  export type AppSettingWhereInput = {
    AND?: AppSettingWhereInput | AppSettingWhereInput[]
    OR?: AppSettingWhereInput[]
    NOT?: AppSettingWhereInput | AppSettingWhereInput[]
    key?: StringFilter<"AppSetting"> | string
    value?: StringFilter<"AppSetting"> | string
    description?: StringNullableFilter<"AppSetting"> | string | null
    updatedAt?: DateTimeFilter<"AppSetting"> | Date | string
  }

  export type AppSettingOrderByWithRelationInput = {
    key?: SortOrder
    value?: SortOrder
    description?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
  }

  export type AppSettingWhereUniqueInput = Prisma.AtLeast<{
    key?: string
    AND?: AppSettingWhereInput | AppSettingWhereInput[]
    OR?: AppSettingWhereInput[]
    NOT?: AppSettingWhereInput | AppSettingWhereInput[]
    value?: StringFilter<"AppSetting"> | string
    description?: StringNullableFilter<"AppSetting"> | string | null
    updatedAt?: DateTimeFilter<"AppSetting"> | Date | string
  }, "key">

  export type AppSettingOrderByWithAggregationInput = {
    key?: SortOrder
    value?: SortOrder
    description?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    _count?: AppSettingCountOrderByAggregateInput
    _max?: AppSettingMaxOrderByAggregateInput
    _min?: AppSettingMinOrderByAggregateInput
  }

  export type AppSettingScalarWhereWithAggregatesInput = {
    AND?: AppSettingScalarWhereWithAggregatesInput | AppSettingScalarWhereWithAggregatesInput[]
    OR?: AppSettingScalarWhereWithAggregatesInput[]
    NOT?: AppSettingScalarWhereWithAggregatesInput | AppSettingScalarWhereWithAggregatesInput[]
    key?: StringWithAggregatesFilter<"AppSetting"> | string
    value?: StringWithAggregatesFilter<"AppSetting"> | string
    description?: StringNullableWithAggregatesFilter<"AppSetting"> | string | null
    updatedAt?: DateTimeWithAggregatesFilter<"AppSetting"> | Date | string
  }

  export type RoutePointWhereInput = {
    AND?: RoutePointWhereInput | RoutePointWhereInput[]
    OR?: RoutePointWhereInput[]
    NOT?: RoutePointWhereInput | RoutePointWhereInput[]
    id?: StringFilter<"RoutePoint"> | string
    orderIndex?: IntFilter<"RoutePoint"> | number
    name?: StringFilter<"RoutePoint"> | string
    distanceKm?: StringFilter<"RoutePoint"> | string
    category?: StringFilter<"RoutePoint"> | string
    description?: StringFilter<"RoutePoint"> | string
    icon?: StringNullableFilter<"RoutePoint"> | string | null
    image?: StringNullableFilter<"RoutePoint"> | string | null
    isWaterStation?: BoolFilter<"RoutePoint"> | boolean
    isMedicalSpot?: BoolFilter<"RoutePoint"> | boolean
    createdAt?: DateTimeFilter<"RoutePoint"> | Date | string
    updatedAt?: DateTimeFilter<"RoutePoint"> | Date | string
  }

  export type RoutePointOrderByWithRelationInput = {
    id?: SortOrder
    orderIndex?: SortOrder
    name?: SortOrder
    distanceKm?: SortOrder
    category?: SortOrder
    description?: SortOrder
    icon?: SortOrderInput | SortOrder
    image?: SortOrderInput | SortOrder
    isWaterStation?: SortOrder
    isMedicalSpot?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RoutePointWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: RoutePointWhereInput | RoutePointWhereInput[]
    OR?: RoutePointWhereInput[]
    NOT?: RoutePointWhereInput | RoutePointWhereInput[]
    orderIndex?: IntFilter<"RoutePoint"> | number
    name?: StringFilter<"RoutePoint"> | string
    distanceKm?: StringFilter<"RoutePoint"> | string
    category?: StringFilter<"RoutePoint"> | string
    description?: StringFilter<"RoutePoint"> | string
    icon?: StringNullableFilter<"RoutePoint"> | string | null
    image?: StringNullableFilter<"RoutePoint"> | string | null
    isWaterStation?: BoolFilter<"RoutePoint"> | boolean
    isMedicalSpot?: BoolFilter<"RoutePoint"> | boolean
    createdAt?: DateTimeFilter<"RoutePoint"> | Date | string
    updatedAt?: DateTimeFilter<"RoutePoint"> | Date | string
  }, "id">

  export type RoutePointOrderByWithAggregationInput = {
    id?: SortOrder
    orderIndex?: SortOrder
    name?: SortOrder
    distanceKm?: SortOrder
    category?: SortOrder
    description?: SortOrder
    icon?: SortOrderInput | SortOrder
    image?: SortOrderInput | SortOrder
    isWaterStation?: SortOrder
    isMedicalSpot?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: RoutePointCountOrderByAggregateInput
    _avg?: RoutePointAvgOrderByAggregateInput
    _max?: RoutePointMaxOrderByAggregateInput
    _min?: RoutePointMinOrderByAggregateInput
    _sum?: RoutePointSumOrderByAggregateInput
  }

  export type RoutePointScalarWhereWithAggregatesInput = {
    AND?: RoutePointScalarWhereWithAggregatesInput | RoutePointScalarWhereWithAggregatesInput[]
    OR?: RoutePointScalarWhereWithAggregatesInput[]
    NOT?: RoutePointScalarWhereWithAggregatesInput | RoutePointScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RoutePoint"> | string
    orderIndex?: IntWithAggregatesFilter<"RoutePoint"> | number
    name?: StringWithAggregatesFilter<"RoutePoint"> | string
    distanceKm?: StringWithAggregatesFilter<"RoutePoint"> | string
    category?: StringWithAggregatesFilter<"RoutePoint"> | string
    description?: StringWithAggregatesFilter<"RoutePoint"> | string
    icon?: StringNullableWithAggregatesFilter<"RoutePoint"> | string | null
    image?: StringNullableWithAggregatesFilter<"RoutePoint"> | string | null
    isWaterStation?: BoolWithAggregatesFilter<"RoutePoint"> | boolean
    isMedicalSpot?: BoolWithAggregatesFilter<"RoutePoint"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"RoutePoint"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"RoutePoint"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    fullName: string
    email: string
    phoneNumber: string
    createdAt?: Date | string
    orders?: OrderCreateNestedManyWithoutUserInput
    logs?: LogCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    fullName: string
    email: string
    phoneNumber: string
    createdAt?: Date | string
    orders?: OrderUncheckedCreateNestedManyWithoutUserInput
    logs?: LogUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orders?: OrderUpdateManyWithoutUserNestedInput
    logs?: LogUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orders?: OrderUncheckedUpdateManyWithoutUserNestedInput
    logs?: LogUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    fullName: string
    email: string
    phoneNumber: string
    createdAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventCreateInput = {
    id?: string
    ticketName: string
    category: string
    stock: number
    price: Decimal | DecimalJsLike | number | string
    ticketImage?: string | null
    medalImage?: string | null
    eventDate?: Date | string | null
    followGlobalTimer?: boolean
    isClosed?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    participants?: ParticipantCreateNestedManyWithoutEventInput
    benefits?: EventBenefitCreateNestedManyWithoutEventInput
    jerseys?: JerseyCreateNestedManyWithoutEventInput
    bibConfig?: BibConfigurationCreateNestedOneWithoutEventInput
  }

  export type EventUncheckedCreateInput = {
    id?: string
    ticketName: string
    category: string
    stock: number
    price: Decimal | DecimalJsLike | number | string
    ticketImage?: string | null
    medalImage?: string | null
    eventDate?: Date | string | null
    followGlobalTimer?: boolean
    isClosed?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    participants?: ParticipantUncheckedCreateNestedManyWithoutEventInput
    benefits?: EventBenefitUncheckedCreateNestedManyWithoutEventInput
    jerseys?: JerseyUncheckedCreateNestedManyWithoutEventInput
    bibConfig?: BibConfigurationUncheckedCreateNestedOneWithoutEventInput
  }

  export type EventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticketName?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    stock?: IntFieldUpdateOperationsInput | number
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    ticketImage?: NullableStringFieldUpdateOperationsInput | string | null
    medalImage?: NullableStringFieldUpdateOperationsInput | string | null
    eventDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    followGlobalTimer?: BoolFieldUpdateOperationsInput | boolean
    isClosed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: ParticipantUpdateManyWithoutEventNestedInput
    benefits?: EventBenefitUpdateManyWithoutEventNestedInput
    jerseys?: JerseyUpdateManyWithoutEventNestedInput
    bibConfig?: BibConfigurationUpdateOneWithoutEventNestedInput
  }

  export type EventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticketName?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    stock?: IntFieldUpdateOperationsInput | number
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    ticketImage?: NullableStringFieldUpdateOperationsInput | string | null
    medalImage?: NullableStringFieldUpdateOperationsInput | string | null
    eventDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    followGlobalTimer?: BoolFieldUpdateOperationsInput | boolean
    isClosed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: ParticipantUncheckedUpdateManyWithoutEventNestedInput
    benefits?: EventBenefitUncheckedUpdateManyWithoutEventNestedInput
    jerseys?: JerseyUncheckedUpdateManyWithoutEventNestedInput
    bibConfig?: BibConfigurationUncheckedUpdateOneWithoutEventNestedInput
  }

  export type EventCreateManyInput = {
    id?: string
    ticketName: string
    category: string
    stock: number
    price: Decimal | DecimalJsLike | number | string
    ticketImage?: string | null
    medalImage?: string | null
    eventDate?: Date | string | null
    followGlobalTimer?: boolean
    isClosed?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticketName?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    stock?: IntFieldUpdateOperationsInput | number
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    ticketImage?: NullableStringFieldUpdateOperationsInput | string | null
    medalImage?: NullableStringFieldUpdateOperationsInput | string | null
    eventDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    followGlobalTimer?: BoolFieldUpdateOperationsInput | boolean
    isClosed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticketName?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    stock?: IntFieldUpdateOperationsInput | number
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    ticketImage?: NullableStringFieldUpdateOperationsInput | string | null
    medalImage?: NullableStringFieldUpdateOperationsInput | string | null
    eventDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    followGlobalTimer?: BoolFieldUpdateOperationsInput | boolean
    isClosed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventBenefitCreateInput = {
    id?: string
    name: string
    description: string
    image?: string | null
    event: EventCreateNestedOneWithoutBenefitsInput
  }

  export type EventBenefitUncheckedCreateInput = {
    id?: string
    eventId: string
    name: string
    description: string
    image?: string | null
  }

  export type EventBenefitUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    event?: EventUpdateOneRequiredWithoutBenefitsNestedInput
  }

  export type EventBenefitUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type EventBenefitCreateManyInput = {
    id?: string
    eventId: string
    name: string
    description: string
    image?: string | null
  }

  export type EventBenefitUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type EventBenefitUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type JerseyCreateInput = {
    id?: string
    name: string
    type: string
    sizes: JsonNullValueInput | InputJsonValue
    image?: string | null
    bannerImages?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    event: EventCreateNestedOneWithoutJerseysInput
    participants?: ParticipantCreateNestedManyWithoutJerseyInput
  }

  export type JerseyUncheckedCreateInput = {
    id?: string
    eventId: string
    name: string
    type: string
    sizes: JsonNullValueInput | InputJsonValue
    image?: string | null
    bannerImages?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    participants?: ParticipantUncheckedCreateNestedManyWithoutJerseyInput
  }

  export type JerseyUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    sizes?: JsonNullValueInput | InputJsonValue
    image?: NullableStringFieldUpdateOperationsInput | string | null
    bannerImages?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    event?: EventUpdateOneRequiredWithoutJerseysNestedInput
    participants?: ParticipantUpdateManyWithoutJerseyNestedInput
  }

  export type JerseyUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    sizes?: JsonNullValueInput | InputJsonValue
    image?: NullableStringFieldUpdateOperationsInput | string | null
    bannerImages?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: ParticipantUncheckedUpdateManyWithoutJerseyNestedInput
  }

  export type JerseyCreateManyInput = {
    id?: string
    eventId: string
    name: string
    type: string
    sizes: JsonNullValueInput | InputJsonValue
    image?: string | null
    bannerImages?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type JerseyUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    sizes?: JsonNullValueInput | InputJsonValue
    image?: NullableStringFieldUpdateOperationsInput | string | null
    bannerImages?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JerseyUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    sizes?: JsonNullValueInput | InputJsonValue
    image?: NullableStringFieldUpdateOperationsInput | string | null
    bannerImages?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderCreateInput = {
    id?: string
    totalAmount: Decimal | DecimalJsLike | number | string
    status?: $Enums.OrderStatus
    midtransOrderId?: string | null
    snapToken?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutOrdersInput
    participants?: ParticipantCreateNestedManyWithoutOrderInput
    masterQrToken?: QrTokenCreateNestedOneWithoutOrderInput
  }

  export type OrderUncheckedCreateInput = {
    id?: string
    userId: string
    totalAmount: Decimal | DecimalJsLike | number | string
    status?: $Enums.OrderStatus
    midtransOrderId?: string | null
    snapToken?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    participants?: ParticipantUncheckedCreateNestedManyWithoutOrderInput
    masterQrToken?: QrTokenUncheckedCreateNestedOneWithoutOrderInput
  }

  export type OrderUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    midtransOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    snapToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutOrdersNestedInput
    participants?: ParticipantUpdateManyWithoutOrderNestedInput
    masterQrToken?: QrTokenUpdateOneWithoutOrderNestedInput
  }

  export type OrderUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    midtransOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    snapToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: ParticipantUncheckedUpdateManyWithoutOrderNestedInput
    masterQrToken?: QrTokenUncheckedUpdateOneWithoutOrderNestedInput
  }

  export type OrderCreateManyInput = {
    id?: string
    userId: string
    totalAmount: Decimal | DecimalJsLike | number | string
    status?: $Enums.OrderStatus
    midtransOrderId?: string | null
    snapToken?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrderUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    midtransOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    snapToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    midtransOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    snapToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ParticipantCreateInput = {
    id?: string
    fullNameKtp: string
    bibName: string
    phoneNumber?: string | null
    nik: string
    gender: $Enums.Gender
    birthPlace: string
    birthDate: Date | string
    fullAddress: string
    country?: string
    bloodType: $Enums.BloodType
    medicalHistory?: string | null
    emergencyContactName: string
    emergencyContactPhone: string
    selectedSize?: string | null
    communityName?: string | null
    bibNumber?: string | null
    createdAt?: Date | string
    order: OrderCreateNestedOneWithoutParticipantsInput
    event: EventCreateNestedOneWithoutParticipantsInput
    jersey?: JerseyCreateNestedOneWithoutParticipantsInput
    qrToken?: QrTokenCreateNestedOneWithoutParticipantInput
  }

  export type ParticipantUncheckedCreateInput = {
    id?: string
    orderId: string
    eventId: string
    fullNameKtp: string
    bibName: string
    phoneNumber?: string | null
    nik: string
    gender: $Enums.Gender
    birthPlace: string
    birthDate: Date | string
    fullAddress: string
    country?: string
    bloodType: $Enums.BloodType
    medicalHistory?: string | null
    emergencyContactName: string
    emergencyContactPhone: string
    jerseyId?: string | null
    selectedSize?: string | null
    communityName?: string | null
    bibNumber?: string | null
    createdAt?: Date | string
    qrToken?: QrTokenUncheckedCreateNestedOneWithoutParticipantInput
  }

  export type ParticipantUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullNameKtp?: StringFieldUpdateOperationsInput | string
    bibName?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    nik?: StringFieldUpdateOperationsInput | string
    gender?: EnumGenderFieldUpdateOperationsInput | $Enums.Gender
    birthPlace?: StringFieldUpdateOperationsInput | string
    birthDate?: DateTimeFieldUpdateOperationsInput | Date | string
    fullAddress?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    bloodType?: EnumBloodTypeFieldUpdateOperationsInput | $Enums.BloodType
    medicalHistory?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContactName?: StringFieldUpdateOperationsInput | string
    emergencyContactPhone?: StringFieldUpdateOperationsInput | string
    selectedSize?: NullableStringFieldUpdateOperationsInput | string | null
    communityName?: NullableStringFieldUpdateOperationsInput | string | null
    bibNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    order?: OrderUpdateOneRequiredWithoutParticipantsNestedInput
    event?: EventUpdateOneRequiredWithoutParticipantsNestedInput
    jersey?: JerseyUpdateOneWithoutParticipantsNestedInput
    qrToken?: QrTokenUpdateOneWithoutParticipantNestedInput
  }

  export type ParticipantUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    fullNameKtp?: StringFieldUpdateOperationsInput | string
    bibName?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    nik?: StringFieldUpdateOperationsInput | string
    gender?: EnumGenderFieldUpdateOperationsInput | $Enums.Gender
    birthPlace?: StringFieldUpdateOperationsInput | string
    birthDate?: DateTimeFieldUpdateOperationsInput | Date | string
    fullAddress?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    bloodType?: EnumBloodTypeFieldUpdateOperationsInput | $Enums.BloodType
    medicalHistory?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContactName?: StringFieldUpdateOperationsInput | string
    emergencyContactPhone?: StringFieldUpdateOperationsInput | string
    jerseyId?: NullableStringFieldUpdateOperationsInput | string | null
    selectedSize?: NullableStringFieldUpdateOperationsInput | string | null
    communityName?: NullableStringFieldUpdateOperationsInput | string | null
    bibNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    qrToken?: QrTokenUncheckedUpdateOneWithoutParticipantNestedInput
  }

  export type ParticipantCreateManyInput = {
    id?: string
    orderId: string
    eventId: string
    fullNameKtp: string
    bibName: string
    phoneNumber?: string | null
    nik: string
    gender: $Enums.Gender
    birthPlace: string
    birthDate: Date | string
    fullAddress: string
    country?: string
    bloodType: $Enums.BloodType
    medicalHistory?: string | null
    emergencyContactName: string
    emergencyContactPhone: string
    jerseyId?: string | null
    selectedSize?: string | null
    communityName?: string | null
    bibNumber?: string | null
    createdAt?: Date | string
  }

  export type ParticipantUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullNameKtp?: StringFieldUpdateOperationsInput | string
    bibName?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    nik?: StringFieldUpdateOperationsInput | string
    gender?: EnumGenderFieldUpdateOperationsInput | $Enums.Gender
    birthPlace?: StringFieldUpdateOperationsInput | string
    birthDate?: DateTimeFieldUpdateOperationsInput | Date | string
    fullAddress?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    bloodType?: EnumBloodTypeFieldUpdateOperationsInput | $Enums.BloodType
    medicalHistory?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContactName?: StringFieldUpdateOperationsInput | string
    emergencyContactPhone?: StringFieldUpdateOperationsInput | string
    selectedSize?: NullableStringFieldUpdateOperationsInput | string | null
    communityName?: NullableStringFieldUpdateOperationsInput | string | null
    bibNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ParticipantUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    fullNameKtp?: StringFieldUpdateOperationsInput | string
    bibName?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    nik?: StringFieldUpdateOperationsInput | string
    gender?: EnumGenderFieldUpdateOperationsInput | $Enums.Gender
    birthPlace?: StringFieldUpdateOperationsInput | string
    birthDate?: DateTimeFieldUpdateOperationsInput | Date | string
    fullAddress?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    bloodType?: EnumBloodTypeFieldUpdateOperationsInput | $Enums.BloodType
    medicalHistory?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContactName?: StringFieldUpdateOperationsInput | string
    emergencyContactPhone?: StringFieldUpdateOperationsInput | string
    jerseyId?: NullableStringFieldUpdateOperationsInput | string | null
    selectedSize?: NullableStringFieldUpdateOperationsInput | string | null
    communityName?: NullableStringFieldUpdateOperationsInput | string | null
    bibNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QrTokenCreateInput = {
    token: string
    createdAt?: Date | string
    participant?: ParticipantCreateNestedOneWithoutQrTokenInput
    order?: OrderCreateNestedOneWithoutMasterQrTokenInput
  }

  export type QrTokenUncheckedCreateInput = {
    token: string
    participantId?: string | null
    orderId?: string | null
    createdAt?: Date | string
  }

  export type QrTokenUpdateInput = {
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participant?: ParticipantUpdateOneWithoutQrTokenNestedInput
    order?: OrderUpdateOneWithoutMasterQrTokenNestedInput
  }

  export type QrTokenUncheckedUpdateInput = {
    token?: StringFieldUpdateOperationsInput | string
    participantId?: NullableStringFieldUpdateOperationsInput | string | null
    orderId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QrTokenCreateManyInput = {
    token: string
    participantId?: string | null
    orderId?: string | null
    createdAt?: Date | string
  }

  export type QrTokenUpdateManyMutationInput = {
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QrTokenUncheckedUpdateManyInput = {
    token?: StringFieldUpdateOperationsInput | string
    participantId?: NullableStringFieldUpdateOperationsInput | string | null
    orderId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LogCreateInput = {
    id?: string
    action: string
    description: string
    entityType?: string | null
    entityId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    user?: UserCreateNestedOneWithoutLogsInput
    admin?: AdminCreateNestedOneWithoutLogsInput
  }

  export type LogUncheckedCreateInput = {
    id?: string
    action: string
    description: string
    userId?: string | null
    adminId?: string | null
    entityType?: string | null
    entityId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type LogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    entityType?: NullableStringFieldUpdateOperationsInput | string | null
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutLogsNestedInput
    admin?: AdminUpdateOneWithoutLogsNestedInput
  }

  export type LogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    adminId?: NullableStringFieldUpdateOperationsInput | string | null
    entityType?: NullableStringFieldUpdateOperationsInput | string | null
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LogCreateManyInput = {
    id?: string
    action: string
    description: string
    userId?: string | null
    adminId?: string | null
    entityType?: string | null
    entityId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type LogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    entityType?: NullableStringFieldUpdateOperationsInput | string | null
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    adminId?: NullableStringFieldUpdateOperationsInput | string | null
    entityType?: NullableStringFieldUpdateOperationsInput | string | null
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BibConfigurationCreateInput = {
    id?: string
    prefix: string
    digitLength: number
    startNumber?: number
    suffix?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    event: EventCreateNestedOneWithoutBibConfigInput
  }

  export type BibConfigurationUncheckedCreateInput = {
    id?: string
    eventId: string
    prefix: string
    digitLength: number
    startNumber?: number
    suffix?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BibConfigurationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    prefix?: StringFieldUpdateOperationsInput | string
    digitLength?: IntFieldUpdateOperationsInput | number
    startNumber?: IntFieldUpdateOperationsInput | number
    suffix?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    event?: EventUpdateOneRequiredWithoutBibConfigNestedInput
  }

  export type BibConfigurationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    prefix?: StringFieldUpdateOperationsInput | string
    digitLength?: IntFieldUpdateOperationsInput | number
    startNumber?: IntFieldUpdateOperationsInput | number
    suffix?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BibConfigurationCreateManyInput = {
    id?: string
    eventId: string
    prefix: string
    digitLength: number
    startNumber?: number
    suffix?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BibConfigurationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    prefix?: StringFieldUpdateOperationsInput | string
    digitLength?: IntFieldUpdateOperationsInput | number
    startNumber?: IntFieldUpdateOperationsInput | number
    suffix?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BibConfigurationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    prefix?: StringFieldUpdateOperationsInput | string
    digitLength?: IntFieldUpdateOperationsInput | number
    startNumber?: IntFieldUpdateOperationsInput | number
    suffix?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoleCreateInput = {
    id?: string
    name: string
    description?: string | null
    permissions: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    admins?: AdminCreateNestedManyWithoutRoleInput
  }

  export type RoleUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    permissions: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    admins?: AdminUncheckedCreateNestedManyWithoutRoleInput
  }

  export type RoleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    permissions?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    admins?: AdminUpdateManyWithoutRoleNestedInput
  }

  export type RoleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    permissions?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    admins?: AdminUncheckedUpdateManyWithoutRoleNestedInput
  }

  export type RoleCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    permissions: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RoleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    permissions?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    permissions?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminCreateInput = {
    id?: string
    username: string
    email: string
    password: string
    fullName: string
    isActive?: boolean
    tokenVersion?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    role: RoleCreateNestedOneWithoutAdminsInput
    logs?: LogCreateNestedManyWithoutAdminInput
  }

  export type AdminUncheckedCreateInput = {
    id?: string
    username: string
    email: string
    password: string
    fullName: string
    roleId: string
    isActive?: boolean
    tokenVersion?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    logs?: LogUncheckedCreateNestedManyWithoutAdminInput
  }

  export type AdminUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    tokenVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    role?: RoleUpdateOneRequiredWithoutAdminsNestedInput
    logs?: LogUpdateManyWithoutAdminNestedInput
  }

  export type AdminUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    roleId?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    tokenVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    logs?: LogUncheckedUpdateManyWithoutAdminNestedInput
  }

  export type AdminCreateManyInput = {
    id?: string
    username: string
    email: string
    password: string
    fullName: string
    roleId: string
    isActive?: boolean
    tokenVersion?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AdminUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    tokenVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    roleId?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    tokenVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppSettingCreateInput = {
    key: string
    value: string
    description?: string | null
    updatedAt?: Date | string
  }

  export type AppSettingUncheckedCreateInput = {
    key: string
    value: string
    description?: string | null
    updatedAt?: Date | string
  }

  export type AppSettingUpdateInput = {
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppSettingUncheckedUpdateInput = {
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppSettingCreateManyInput = {
    key: string
    value: string
    description?: string | null
    updatedAt?: Date | string
  }

  export type AppSettingUpdateManyMutationInput = {
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppSettingUncheckedUpdateManyInput = {
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoutePointCreateInput = {
    id?: string
    orderIndex?: number
    name: string
    distanceKm: string
    category?: string
    description: string
    icon?: string | null
    image?: string | null
    isWaterStation?: boolean
    isMedicalSpot?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RoutePointUncheckedCreateInput = {
    id?: string
    orderIndex?: number
    name: string
    distanceKm: string
    category?: string
    description: string
    icon?: string | null
    image?: string | null
    isWaterStation?: boolean
    isMedicalSpot?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RoutePointUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderIndex?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    distanceKm?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    isWaterStation?: BoolFieldUpdateOperationsInput | boolean
    isMedicalSpot?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoutePointUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderIndex?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    distanceKm?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    isWaterStation?: BoolFieldUpdateOperationsInput | boolean
    isMedicalSpot?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoutePointCreateManyInput = {
    id?: string
    orderIndex?: number
    name: string
    distanceKm: string
    category?: string
    description: string
    icon?: string | null
    image?: string | null
    isWaterStation?: boolean
    isMedicalSpot?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RoutePointUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderIndex?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    distanceKm?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    isWaterStation?: BoolFieldUpdateOperationsInput | boolean
    isMedicalSpot?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoutePointUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderIndex?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    distanceKm?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    isWaterStation?: BoolFieldUpdateOperationsInput | boolean
    isMedicalSpot?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type OrderListRelationFilter = {
    every?: OrderWhereInput
    some?: OrderWhereInput
    none?: OrderWhereInput
  }

  export type LogListRelationFilter = {
    every?: LogWhereInput
    some?: LogWhereInput
    none?: LogWhereInput
  }

  export type OrderOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    fullName?: SortOrder
    email?: SortOrder
    phoneNumber?: SortOrder
    createdAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    fullName?: SortOrder
    email?: SortOrder
    phoneNumber?: SortOrder
    createdAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    fullName?: SortOrder
    email?: SortOrder
    phoneNumber?: SortOrder
    createdAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type ParticipantListRelationFilter = {
    every?: ParticipantWhereInput
    some?: ParticipantWhereInput
    none?: ParticipantWhereInput
  }

  export type EventBenefitListRelationFilter = {
    every?: EventBenefitWhereInput
    some?: EventBenefitWhereInput
    none?: EventBenefitWhereInput
  }

  export type JerseyListRelationFilter = {
    every?: JerseyWhereInput
    some?: JerseyWhereInput
    none?: JerseyWhereInput
  }

  export type BibConfigurationNullableRelationFilter = {
    is?: BibConfigurationWhereInput | null
    isNot?: BibConfigurationWhereInput | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ParticipantOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EventBenefitOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type JerseyOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EventCountOrderByAggregateInput = {
    id?: SortOrder
    ticketName?: SortOrder
    category?: SortOrder
    stock?: SortOrder
    price?: SortOrder
    ticketImage?: SortOrder
    medalImage?: SortOrder
    eventDate?: SortOrder
    followGlobalTimer?: SortOrder
    isClosed?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EventAvgOrderByAggregateInput = {
    stock?: SortOrder
    price?: SortOrder
  }

  export type EventMaxOrderByAggregateInput = {
    id?: SortOrder
    ticketName?: SortOrder
    category?: SortOrder
    stock?: SortOrder
    price?: SortOrder
    ticketImage?: SortOrder
    medalImage?: SortOrder
    eventDate?: SortOrder
    followGlobalTimer?: SortOrder
    isClosed?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EventMinOrderByAggregateInput = {
    id?: SortOrder
    ticketName?: SortOrder
    category?: SortOrder
    stock?: SortOrder
    price?: SortOrder
    ticketImage?: SortOrder
    medalImage?: SortOrder
    eventDate?: SortOrder
    followGlobalTimer?: SortOrder
    isClosed?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EventSumOrderByAggregateInput = {
    stock?: SortOrder
    price?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type EventRelationFilter = {
    is?: EventWhereInput
    isNot?: EventWhereInput
  }

  export type EventBenefitCountOrderByAggregateInput = {
    id?: SortOrder
    eventId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    image?: SortOrder
  }

  export type EventBenefitMaxOrderByAggregateInput = {
    id?: SortOrder
    eventId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    image?: SortOrder
  }

  export type EventBenefitMinOrderByAggregateInput = {
    id?: SortOrder
    eventId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    image?: SortOrder
  }
  export type JsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }
  export type JsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type JerseyCountOrderByAggregateInput = {
    id?: SortOrder
    eventId?: SortOrder
    name?: SortOrder
    type?: SortOrder
    sizes?: SortOrder
    image?: SortOrder
    bannerImages?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type JerseyMaxOrderByAggregateInput = {
    id?: SortOrder
    eventId?: SortOrder
    name?: SortOrder
    type?: SortOrder
    image?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type JerseyMinOrderByAggregateInput = {
    id?: SortOrder
    eventId?: SortOrder
    name?: SortOrder
    type?: SortOrder
    image?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type EnumOrderStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.OrderStatus | EnumOrderStatusFieldRefInput<$PrismaModel>
    in?: $Enums.OrderStatus[] | ListEnumOrderStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.OrderStatus[] | ListEnumOrderStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumOrderStatusFilter<$PrismaModel> | $Enums.OrderStatus
  }

  export type UserRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type QrTokenNullableRelationFilter = {
    is?: QrTokenWhereInput | null
    isNot?: QrTokenWhereInput | null
  }

  export type OrderCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    totalAmount?: SortOrder
    status?: SortOrder
    midtransOrderId?: SortOrder
    snapToken?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OrderAvgOrderByAggregateInput = {
    totalAmount?: SortOrder
  }

  export type OrderMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    totalAmount?: SortOrder
    status?: SortOrder
    midtransOrderId?: SortOrder
    snapToken?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OrderMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    totalAmount?: SortOrder
    status?: SortOrder
    midtransOrderId?: SortOrder
    snapToken?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OrderSumOrderByAggregateInput = {
    totalAmount?: SortOrder
  }

  export type EnumOrderStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.OrderStatus | EnumOrderStatusFieldRefInput<$PrismaModel>
    in?: $Enums.OrderStatus[] | ListEnumOrderStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.OrderStatus[] | ListEnumOrderStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumOrderStatusWithAggregatesFilter<$PrismaModel> | $Enums.OrderStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumOrderStatusFilter<$PrismaModel>
    _max?: NestedEnumOrderStatusFilter<$PrismaModel>
  }

  export type EnumGenderFilter<$PrismaModel = never> = {
    equals?: $Enums.Gender | EnumGenderFieldRefInput<$PrismaModel>
    in?: $Enums.Gender[] | ListEnumGenderFieldRefInput<$PrismaModel>
    notIn?: $Enums.Gender[] | ListEnumGenderFieldRefInput<$PrismaModel>
    not?: NestedEnumGenderFilter<$PrismaModel> | $Enums.Gender
  }

  export type EnumBloodTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.BloodType | EnumBloodTypeFieldRefInput<$PrismaModel>
    in?: $Enums.BloodType[] | ListEnumBloodTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.BloodType[] | ListEnumBloodTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumBloodTypeFilter<$PrismaModel> | $Enums.BloodType
  }

  export type OrderRelationFilter = {
    is?: OrderWhereInput
    isNot?: OrderWhereInput
  }

  export type JerseyNullableRelationFilter = {
    is?: JerseyWhereInput | null
    isNot?: JerseyWhereInput | null
  }

  export type ParticipantCountOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    eventId?: SortOrder
    fullNameKtp?: SortOrder
    bibName?: SortOrder
    phoneNumber?: SortOrder
    nik?: SortOrder
    gender?: SortOrder
    birthPlace?: SortOrder
    birthDate?: SortOrder
    fullAddress?: SortOrder
    country?: SortOrder
    bloodType?: SortOrder
    medicalHistory?: SortOrder
    emergencyContactName?: SortOrder
    emergencyContactPhone?: SortOrder
    jerseyId?: SortOrder
    selectedSize?: SortOrder
    communityName?: SortOrder
    bibNumber?: SortOrder
    createdAt?: SortOrder
  }

  export type ParticipantMaxOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    eventId?: SortOrder
    fullNameKtp?: SortOrder
    bibName?: SortOrder
    phoneNumber?: SortOrder
    nik?: SortOrder
    gender?: SortOrder
    birthPlace?: SortOrder
    birthDate?: SortOrder
    fullAddress?: SortOrder
    country?: SortOrder
    bloodType?: SortOrder
    medicalHistory?: SortOrder
    emergencyContactName?: SortOrder
    emergencyContactPhone?: SortOrder
    jerseyId?: SortOrder
    selectedSize?: SortOrder
    communityName?: SortOrder
    bibNumber?: SortOrder
    createdAt?: SortOrder
  }

  export type ParticipantMinOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    eventId?: SortOrder
    fullNameKtp?: SortOrder
    bibName?: SortOrder
    phoneNumber?: SortOrder
    nik?: SortOrder
    gender?: SortOrder
    birthPlace?: SortOrder
    birthDate?: SortOrder
    fullAddress?: SortOrder
    country?: SortOrder
    bloodType?: SortOrder
    medicalHistory?: SortOrder
    emergencyContactName?: SortOrder
    emergencyContactPhone?: SortOrder
    jerseyId?: SortOrder
    selectedSize?: SortOrder
    communityName?: SortOrder
    bibNumber?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumGenderWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Gender | EnumGenderFieldRefInput<$PrismaModel>
    in?: $Enums.Gender[] | ListEnumGenderFieldRefInput<$PrismaModel>
    notIn?: $Enums.Gender[] | ListEnumGenderFieldRefInput<$PrismaModel>
    not?: NestedEnumGenderWithAggregatesFilter<$PrismaModel> | $Enums.Gender
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumGenderFilter<$PrismaModel>
    _max?: NestedEnumGenderFilter<$PrismaModel>
  }

  export type EnumBloodTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BloodType | EnumBloodTypeFieldRefInput<$PrismaModel>
    in?: $Enums.BloodType[] | ListEnumBloodTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.BloodType[] | ListEnumBloodTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumBloodTypeWithAggregatesFilter<$PrismaModel> | $Enums.BloodType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBloodTypeFilter<$PrismaModel>
    _max?: NestedEnumBloodTypeFilter<$PrismaModel>
  }

  export type ParticipantNullableRelationFilter = {
    is?: ParticipantWhereInput | null
    isNot?: ParticipantWhereInput | null
  }

  export type OrderNullableRelationFilter = {
    is?: OrderWhereInput | null
    isNot?: OrderWhereInput | null
  }

  export type QrTokenCountOrderByAggregateInput = {
    token?: SortOrder
    participantId?: SortOrder
    orderId?: SortOrder
    createdAt?: SortOrder
  }

  export type QrTokenMaxOrderByAggregateInput = {
    token?: SortOrder
    participantId?: SortOrder
    orderId?: SortOrder
    createdAt?: SortOrder
  }

  export type QrTokenMinOrderByAggregateInput = {
    token?: SortOrder
    participantId?: SortOrder
    orderId?: SortOrder
    createdAt?: SortOrder
  }

  export type UserNullableRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type AdminNullableRelationFilter = {
    is?: AdminWhereInput | null
    isNot?: AdminWhereInput | null
  }

  export type LogCountOrderByAggregateInput = {
    id?: SortOrder
    action?: SortOrder
    description?: SortOrder
    userId?: SortOrder
    adminId?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
  }

  export type LogMaxOrderByAggregateInput = {
    id?: SortOrder
    action?: SortOrder
    description?: SortOrder
    userId?: SortOrder
    adminId?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    createdAt?: SortOrder
  }

  export type LogMinOrderByAggregateInput = {
    id?: SortOrder
    action?: SortOrder
    description?: SortOrder
    userId?: SortOrder
    adminId?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    createdAt?: SortOrder
  }

  export type BibConfigurationCountOrderByAggregateInput = {
    id?: SortOrder
    eventId?: SortOrder
    prefix?: SortOrder
    digitLength?: SortOrder
    startNumber?: SortOrder
    suffix?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BibConfigurationAvgOrderByAggregateInput = {
    digitLength?: SortOrder
    startNumber?: SortOrder
  }

  export type BibConfigurationMaxOrderByAggregateInput = {
    id?: SortOrder
    eventId?: SortOrder
    prefix?: SortOrder
    digitLength?: SortOrder
    startNumber?: SortOrder
    suffix?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BibConfigurationMinOrderByAggregateInput = {
    id?: SortOrder
    eventId?: SortOrder
    prefix?: SortOrder
    digitLength?: SortOrder
    startNumber?: SortOrder
    suffix?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BibConfigurationSumOrderByAggregateInput = {
    digitLength?: SortOrder
    startNumber?: SortOrder
  }

  export type AdminListRelationFilter = {
    every?: AdminWhereInput
    some?: AdminWhereInput
    none?: AdminWhereInput
  }

  export type AdminOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RoleCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    permissions?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RoleMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RoleMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RoleRelationFilter = {
    is?: RoleWhereInput
    isNot?: RoleWhereInput
  }

  export type AdminCountOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    email?: SortOrder
    password?: SortOrder
    fullName?: SortOrder
    roleId?: SortOrder
    isActive?: SortOrder
    tokenVersion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AdminAvgOrderByAggregateInput = {
    tokenVersion?: SortOrder
  }

  export type AdminMaxOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    email?: SortOrder
    password?: SortOrder
    fullName?: SortOrder
    roleId?: SortOrder
    isActive?: SortOrder
    tokenVersion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AdminMinOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    email?: SortOrder
    password?: SortOrder
    fullName?: SortOrder
    roleId?: SortOrder
    isActive?: SortOrder
    tokenVersion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AdminSumOrderByAggregateInput = {
    tokenVersion?: SortOrder
  }

  export type AppSettingCountOrderByAggregateInput = {
    key?: SortOrder
    value?: SortOrder
    description?: SortOrder
    updatedAt?: SortOrder
  }

  export type AppSettingMaxOrderByAggregateInput = {
    key?: SortOrder
    value?: SortOrder
    description?: SortOrder
    updatedAt?: SortOrder
  }

  export type AppSettingMinOrderByAggregateInput = {
    key?: SortOrder
    value?: SortOrder
    description?: SortOrder
    updatedAt?: SortOrder
  }

  export type RoutePointCountOrderByAggregateInput = {
    id?: SortOrder
    orderIndex?: SortOrder
    name?: SortOrder
    distanceKm?: SortOrder
    category?: SortOrder
    description?: SortOrder
    icon?: SortOrder
    image?: SortOrder
    isWaterStation?: SortOrder
    isMedicalSpot?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RoutePointAvgOrderByAggregateInput = {
    orderIndex?: SortOrder
  }

  export type RoutePointMaxOrderByAggregateInput = {
    id?: SortOrder
    orderIndex?: SortOrder
    name?: SortOrder
    distanceKm?: SortOrder
    category?: SortOrder
    description?: SortOrder
    icon?: SortOrder
    image?: SortOrder
    isWaterStation?: SortOrder
    isMedicalSpot?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RoutePointMinOrderByAggregateInput = {
    id?: SortOrder
    orderIndex?: SortOrder
    name?: SortOrder
    distanceKm?: SortOrder
    category?: SortOrder
    description?: SortOrder
    icon?: SortOrder
    image?: SortOrder
    isWaterStation?: SortOrder
    isMedicalSpot?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RoutePointSumOrderByAggregateInput = {
    orderIndex?: SortOrder
  }

  export type OrderCreateNestedManyWithoutUserInput = {
    create?: XOR<OrderCreateWithoutUserInput, OrderUncheckedCreateWithoutUserInput> | OrderCreateWithoutUserInput[] | OrderUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OrderCreateOrConnectWithoutUserInput | OrderCreateOrConnectWithoutUserInput[]
    createMany?: OrderCreateManyUserInputEnvelope
    connect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
  }

  export type LogCreateNestedManyWithoutUserInput = {
    create?: XOR<LogCreateWithoutUserInput, LogUncheckedCreateWithoutUserInput> | LogCreateWithoutUserInput[] | LogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LogCreateOrConnectWithoutUserInput | LogCreateOrConnectWithoutUserInput[]
    createMany?: LogCreateManyUserInputEnvelope
    connect?: LogWhereUniqueInput | LogWhereUniqueInput[]
  }

  export type OrderUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<OrderCreateWithoutUserInput, OrderUncheckedCreateWithoutUserInput> | OrderCreateWithoutUserInput[] | OrderUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OrderCreateOrConnectWithoutUserInput | OrderCreateOrConnectWithoutUserInput[]
    createMany?: OrderCreateManyUserInputEnvelope
    connect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
  }

  export type LogUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<LogCreateWithoutUserInput, LogUncheckedCreateWithoutUserInput> | LogCreateWithoutUserInput[] | LogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LogCreateOrConnectWithoutUserInput | LogCreateOrConnectWithoutUserInput[]
    createMany?: LogCreateManyUserInputEnvelope
    connect?: LogWhereUniqueInput | LogWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type OrderUpdateManyWithoutUserNestedInput = {
    create?: XOR<OrderCreateWithoutUserInput, OrderUncheckedCreateWithoutUserInput> | OrderCreateWithoutUserInput[] | OrderUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OrderCreateOrConnectWithoutUserInput | OrderCreateOrConnectWithoutUserInput[]
    upsert?: OrderUpsertWithWhereUniqueWithoutUserInput | OrderUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: OrderCreateManyUserInputEnvelope
    set?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    disconnect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    delete?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    connect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    update?: OrderUpdateWithWhereUniqueWithoutUserInput | OrderUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: OrderUpdateManyWithWhereWithoutUserInput | OrderUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: OrderScalarWhereInput | OrderScalarWhereInput[]
  }

  export type LogUpdateManyWithoutUserNestedInput = {
    create?: XOR<LogCreateWithoutUserInput, LogUncheckedCreateWithoutUserInput> | LogCreateWithoutUserInput[] | LogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LogCreateOrConnectWithoutUserInput | LogCreateOrConnectWithoutUserInput[]
    upsert?: LogUpsertWithWhereUniqueWithoutUserInput | LogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: LogCreateManyUserInputEnvelope
    set?: LogWhereUniqueInput | LogWhereUniqueInput[]
    disconnect?: LogWhereUniqueInput | LogWhereUniqueInput[]
    delete?: LogWhereUniqueInput | LogWhereUniqueInput[]
    connect?: LogWhereUniqueInput | LogWhereUniqueInput[]
    update?: LogUpdateWithWhereUniqueWithoutUserInput | LogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: LogUpdateManyWithWhereWithoutUserInput | LogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: LogScalarWhereInput | LogScalarWhereInput[]
  }

  export type OrderUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<OrderCreateWithoutUserInput, OrderUncheckedCreateWithoutUserInput> | OrderCreateWithoutUserInput[] | OrderUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OrderCreateOrConnectWithoutUserInput | OrderCreateOrConnectWithoutUserInput[]
    upsert?: OrderUpsertWithWhereUniqueWithoutUserInput | OrderUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: OrderCreateManyUserInputEnvelope
    set?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    disconnect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    delete?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    connect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    update?: OrderUpdateWithWhereUniqueWithoutUserInput | OrderUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: OrderUpdateManyWithWhereWithoutUserInput | OrderUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: OrderScalarWhereInput | OrderScalarWhereInput[]
  }

  export type LogUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<LogCreateWithoutUserInput, LogUncheckedCreateWithoutUserInput> | LogCreateWithoutUserInput[] | LogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LogCreateOrConnectWithoutUserInput | LogCreateOrConnectWithoutUserInput[]
    upsert?: LogUpsertWithWhereUniqueWithoutUserInput | LogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: LogCreateManyUserInputEnvelope
    set?: LogWhereUniqueInput | LogWhereUniqueInput[]
    disconnect?: LogWhereUniqueInput | LogWhereUniqueInput[]
    delete?: LogWhereUniqueInput | LogWhereUniqueInput[]
    connect?: LogWhereUniqueInput | LogWhereUniqueInput[]
    update?: LogUpdateWithWhereUniqueWithoutUserInput | LogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: LogUpdateManyWithWhereWithoutUserInput | LogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: LogScalarWhereInput | LogScalarWhereInput[]
  }

  export type ParticipantCreateNestedManyWithoutEventInput = {
    create?: XOR<ParticipantCreateWithoutEventInput, ParticipantUncheckedCreateWithoutEventInput> | ParticipantCreateWithoutEventInput[] | ParticipantUncheckedCreateWithoutEventInput[]
    connectOrCreate?: ParticipantCreateOrConnectWithoutEventInput | ParticipantCreateOrConnectWithoutEventInput[]
    createMany?: ParticipantCreateManyEventInputEnvelope
    connect?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
  }

  export type EventBenefitCreateNestedManyWithoutEventInput = {
    create?: XOR<EventBenefitCreateWithoutEventInput, EventBenefitUncheckedCreateWithoutEventInput> | EventBenefitCreateWithoutEventInput[] | EventBenefitUncheckedCreateWithoutEventInput[]
    connectOrCreate?: EventBenefitCreateOrConnectWithoutEventInput | EventBenefitCreateOrConnectWithoutEventInput[]
    createMany?: EventBenefitCreateManyEventInputEnvelope
    connect?: EventBenefitWhereUniqueInput | EventBenefitWhereUniqueInput[]
  }

  export type JerseyCreateNestedManyWithoutEventInput = {
    create?: XOR<JerseyCreateWithoutEventInput, JerseyUncheckedCreateWithoutEventInput> | JerseyCreateWithoutEventInput[] | JerseyUncheckedCreateWithoutEventInput[]
    connectOrCreate?: JerseyCreateOrConnectWithoutEventInput | JerseyCreateOrConnectWithoutEventInput[]
    createMany?: JerseyCreateManyEventInputEnvelope
    connect?: JerseyWhereUniqueInput | JerseyWhereUniqueInput[]
  }

  export type BibConfigurationCreateNestedOneWithoutEventInput = {
    create?: XOR<BibConfigurationCreateWithoutEventInput, BibConfigurationUncheckedCreateWithoutEventInput>
    connectOrCreate?: BibConfigurationCreateOrConnectWithoutEventInput
    connect?: BibConfigurationWhereUniqueInput
  }

  export type ParticipantUncheckedCreateNestedManyWithoutEventInput = {
    create?: XOR<ParticipantCreateWithoutEventInput, ParticipantUncheckedCreateWithoutEventInput> | ParticipantCreateWithoutEventInput[] | ParticipantUncheckedCreateWithoutEventInput[]
    connectOrCreate?: ParticipantCreateOrConnectWithoutEventInput | ParticipantCreateOrConnectWithoutEventInput[]
    createMany?: ParticipantCreateManyEventInputEnvelope
    connect?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
  }

  export type EventBenefitUncheckedCreateNestedManyWithoutEventInput = {
    create?: XOR<EventBenefitCreateWithoutEventInput, EventBenefitUncheckedCreateWithoutEventInput> | EventBenefitCreateWithoutEventInput[] | EventBenefitUncheckedCreateWithoutEventInput[]
    connectOrCreate?: EventBenefitCreateOrConnectWithoutEventInput | EventBenefitCreateOrConnectWithoutEventInput[]
    createMany?: EventBenefitCreateManyEventInputEnvelope
    connect?: EventBenefitWhereUniqueInput | EventBenefitWhereUniqueInput[]
  }

  export type JerseyUncheckedCreateNestedManyWithoutEventInput = {
    create?: XOR<JerseyCreateWithoutEventInput, JerseyUncheckedCreateWithoutEventInput> | JerseyCreateWithoutEventInput[] | JerseyUncheckedCreateWithoutEventInput[]
    connectOrCreate?: JerseyCreateOrConnectWithoutEventInput | JerseyCreateOrConnectWithoutEventInput[]
    createMany?: JerseyCreateManyEventInputEnvelope
    connect?: JerseyWhereUniqueInput | JerseyWhereUniqueInput[]
  }

  export type BibConfigurationUncheckedCreateNestedOneWithoutEventInput = {
    create?: XOR<BibConfigurationCreateWithoutEventInput, BibConfigurationUncheckedCreateWithoutEventInput>
    connectOrCreate?: BibConfigurationCreateOrConnectWithoutEventInput
    connect?: BibConfigurationWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type ParticipantUpdateManyWithoutEventNestedInput = {
    create?: XOR<ParticipantCreateWithoutEventInput, ParticipantUncheckedCreateWithoutEventInput> | ParticipantCreateWithoutEventInput[] | ParticipantUncheckedCreateWithoutEventInput[]
    connectOrCreate?: ParticipantCreateOrConnectWithoutEventInput | ParticipantCreateOrConnectWithoutEventInput[]
    upsert?: ParticipantUpsertWithWhereUniqueWithoutEventInput | ParticipantUpsertWithWhereUniqueWithoutEventInput[]
    createMany?: ParticipantCreateManyEventInputEnvelope
    set?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
    disconnect?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
    delete?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
    connect?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
    update?: ParticipantUpdateWithWhereUniqueWithoutEventInput | ParticipantUpdateWithWhereUniqueWithoutEventInput[]
    updateMany?: ParticipantUpdateManyWithWhereWithoutEventInput | ParticipantUpdateManyWithWhereWithoutEventInput[]
    deleteMany?: ParticipantScalarWhereInput | ParticipantScalarWhereInput[]
  }

  export type EventBenefitUpdateManyWithoutEventNestedInput = {
    create?: XOR<EventBenefitCreateWithoutEventInput, EventBenefitUncheckedCreateWithoutEventInput> | EventBenefitCreateWithoutEventInput[] | EventBenefitUncheckedCreateWithoutEventInput[]
    connectOrCreate?: EventBenefitCreateOrConnectWithoutEventInput | EventBenefitCreateOrConnectWithoutEventInput[]
    upsert?: EventBenefitUpsertWithWhereUniqueWithoutEventInput | EventBenefitUpsertWithWhereUniqueWithoutEventInput[]
    createMany?: EventBenefitCreateManyEventInputEnvelope
    set?: EventBenefitWhereUniqueInput | EventBenefitWhereUniqueInput[]
    disconnect?: EventBenefitWhereUniqueInput | EventBenefitWhereUniqueInput[]
    delete?: EventBenefitWhereUniqueInput | EventBenefitWhereUniqueInput[]
    connect?: EventBenefitWhereUniqueInput | EventBenefitWhereUniqueInput[]
    update?: EventBenefitUpdateWithWhereUniqueWithoutEventInput | EventBenefitUpdateWithWhereUniqueWithoutEventInput[]
    updateMany?: EventBenefitUpdateManyWithWhereWithoutEventInput | EventBenefitUpdateManyWithWhereWithoutEventInput[]
    deleteMany?: EventBenefitScalarWhereInput | EventBenefitScalarWhereInput[]
  }

  export type JerseyUpdateManyWithoutEventNestedInput = {
    create?: XOR<JerseyCreateWithoutEventInput, JerseyUncheckedCreateWithoutEventInput> | JerseyCreateWithoutEventInput[] | JerseyUncheckedCreateWithoutEventInput[]
    connectOrCreate?: JerseyCreateOrConnectWithoutEventInput | JerseyCreateOrConnectWithoutEventInput[]
    upsert?: JerseyUpsertWithWhereUniqueWithoutEventInput | JerseyUpsertWithWhereUniqueWithoutEventInput[]
    createMany?: JerseyCreateManyEventInputEnvelope
    set?: JerseyWhereUniqueInput | JerseyWhereUniqueInput[]
    disconnect?: JerseyWhereUniqueInput | JerseyWhereUniqueInput[]
    delete?: JerseyWhereUniqueInput | JerseyWhereUniqueInput[]
    connect?: JerseyWhereUniqueInput | JerseyWhereUniqueInput[]
    update?: JerseyUpdateWithWhereUniqueWithoutEventInput | JerseyUpdateWithWhereUniqueWithoutEventInput[]
    updateMany?: JerseyUpdateManyWithWhereWithoutEventInput | JerseyUpdateManyWithWhereWithoutEventInput[]
    deleteMany?: JerseyScalarWhereInput | JerseyScalarWhereInput[]
  }

  export type BibConfigurationUpdateOneWithoutEventNestedInput = {
    create?: XOR<BibConfigurationCreateWithoutEventInput, BibConfigurationUncheckedCreateWithoutEventInput>
    connectOrCreate?: BibConfigurationCreateOrConnectWithoutEventInput
    upsert?: BibConfigurationUpsertWithoutEventInput
    disconnect?: BibConfigurationWhereInput | boolean
    delete?: BibConfigurationWhereInput | boolean
    connect?: BibConfigurationWhereUniqueInput
    update?: XOR<XOR<BibConfigurationUpdateToOneWithWhereWithoutEventInput, BibConfigurationUpdateWithoutEventInput>, BibConfigurationUncheckedUpdateWithoutEventInput>
  }

  export type ParticipantUncheckedUpdateManyWithoutEventNestedInput = {
    create?: XOR<ParticipantCreateWithoutEventInput, ParticipantUncheckedCreateWithoutEventInput> | ParticipantCreateWithoutEventInput[] | ParticipantUncheckedCreateWithoutEventInput[]
    connectOrCreate?: ParticipantCreateOrConnectWithoutEventInput | ParticipantCreateOrConnectWithoutEventInput[]
    upsert?: ParticipantUpsertWithWhereUniqueWithoutEventInput | ParticipantUpsertWithWhereUniqueWithoutEventInput[]
    createMany?: ParticipantCreateManyEventInputEnvelope
    set?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
    disconnect?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
    delete?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
    connect?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
    update?: ParticipantUpdateWithWhereUniqueWithoutEventInput | ParticipantUpdateWithWhereUniqueWithoutEventInput[]
    updateMany?: ParticipantUpdateManyWithWhereWithoutEventInput | ParticipantUpdateManyWithWhereWithoutEventInput[]
    deleteMany?: ParticipantScalarWhereInput | ParticipantScalarWhereInput[]
  }

  export type EventBenefitUncheckedUpdateManyWithoutEventNestedInput = {
    create?: XOR<EventBenefitCreateWithoutEventInput, EventBenefitUncheckedCreateWithoutEventInput> | EventBenefitCreateWithoutEventInput[] | EventBenefitUncheckedCreateWithoutEventInput[]
    connectOrCreate?: EventBenefitCreateOrConnectWithoutEventInput | EventBenefitCreateOrConnectWithoutEventInput[]
    upsert?: EventBenefitUpsertWithWhereUniqueWithoutEventInput | EventBenefitUpsertWithWhereUniqueWithoutEventInput[]
    createMany?: EventBenefitCreateManyEventInputEnvelope
    set?: EventBenefitWhereUniqueInput | EventBenefitWhereUniqueInput[]
    disconnect?: EventBenefitWhereUniqueInput | EventBenefitWhereUniqueInput[]
    delete?: EventBenefitWhereUniqueInput | EventBenefitWhereUniqueInput[]
    connect?: EventBenefitWhereUniqueInput | EventBenefitWhereUniqueInput[]
    update?: EventBenefitUpdateWithWhereUniqueWithoutEventInput | EventBenefitUpdateWithWhereUniqueWithoutEventInput[]
    updateMany?: EventBenefitUpdateManyWithWhereWithoutEventInput | EventBenefitUpdateManyWithWhereWithoutEventInput[]
    deleteMany?: EventBenefitScalarWhereInput | EventBenefitScalarWhereInput[]
  }

  export type JerseyUncheckedUpdateManyWithoutEventNestedInput = {
    create?: XOR<JerseyCreateWithoutEventInput, JerseyUncheckedCreateWithoutEventInput> | JerseyCreateWithoutEventInput[] | JerseyUncheckedCreateWithoutEventInput[]
    connectOrCreate?: JerseyCreateOrConnectWithoutEventInput | JerseyCreateOrConnectWithoutEventInput[]
    upsert?: JerseyUpsertWithWhereUniqueWithoutEventInput | JerseyUpsertWithWhereUniqueWithoutEventInput[]
    createMany?: JerseyCreateManyEventInputEnvelope
    set?: JerseyWhereUniqueInput | JerseyWhereUniqueInput[]
    disconnect?: JerseyWhereUniqueInput | JerseyWhereUniqueInput[]
    delete?: JerseyWhereUniqueInput | JerseyWhereUniqueInput[]
    connect?: JerseyWhereUniqueInput | JerseyWhereUniqueInput[]
    update?: JerseyUpdateWithWhereUniqueWithoutEventInput | JerseyUpdateWithWhereUniqueWithoutEventInput[]
    updateMany?: JerseyUpdateManyWithWhereWithoutEventInput | JerseyUpdateManyWithWhereWithoutEventInput[]
    deleteMany?: JerseyScalarWhereInput | JerseyScalarWhereInput[]
  }

  export type BibConfigurationUncheckedUpdateOneWithoutEventNestedInput = {
    create?: XOR<BibConfigurationCreateWithoutEventInput, BibConfigurationUncheckedCreateWithoutEventInput>
    connectOrCreate?: BibConfigurationCreateOrConnectWithoutEventInput
    upsert?: BibConfigurationUpsertWithoutEventInput
    disconnect?: BibConfigurationWhereInput | boolean
    delete?: BibConfigurationWhereInput | boolean
    connect?: BibConfigurationWhereUniqueInput
    update?: XOR<XOR<BibConfigurationUpdateToOneWithWhereWithoutEventInput, BibConfigurationUpdateWithoutEventInput>, BibConfigurationUncheckedUpdateWithoutEventInput>
  }

  export type EventCreateNestedOneWithoutBenefitsInput = {
    create?: XOR<EventCreateWithoutBenefitsInput, EventUncheckedCreateWithoutBenefitsInput>
    connectOrCreate?: EventCreateOrConnectWithoutBenefitsInput
    connect?: EventWhereUniqueInput
  }

  export type EventUpdateOneRequiredWithoutBenefitsNestedInput = {
    create?: XOR<EventCreateWithoutBenefitsInput, EventUncheckedCreateWithoutBenefitsInput>
    connectOrCreate?: EventCreateOrConnectWithoutBenefitsInput
    upsert?: EventUpsertWithoutBenefitsInput
    connect?: EventWhereUniqueInput
    update?: XOR<XOR<EventUpdateToOneWithWhereWithoutBenefitsInput, EventUpdateWithoutBenefitsInput>, EventUncheckedUpdateWithoutBenefitsInput>
  }

  export type EventCreateNestedOneWithoutJerseysInput = {
    create?: XOR<EventCreateWithoutJerseysInput, EventUncheckedCreateWithoutJerseysInput>
    connectOrCreate?: EventCreateOrConnectWithoutJerseysInput
    connect?: EventWhereUniqueInput
  }

  export type ParticipantCreateNestedManyWithoutJerseyInput = {
    create?: XOR<ParticipantCreateWithoutJerseyInput, ParticipantUncheckedCreateWithoutJerseyInput> | ParticipantCreateWithoutJerseyInput[] | ParticipantUncheckedCreateWithoutJerseyInput[]
    connectOrCreate?: ParticipantCreateOrConnectWithoutJerseyInput | ParticipantCreateOrConnectWithoutJerseyInput[]
    createMany?: ParticipantCreateManyJerseyInputEnvelope
    connect?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
  }

  export type ParticipantUncheckedCreateNestedManyWithoutJerseyInput = {
    create?: XOR<ParticipantCreateWithoutJerseyInput, ParticipantUncheckedCreateWithoutJerseyInput> | ParticipantCreateWithoutJerseyInput[] | ParticipantUncheckedCreateWithoutJerseyInput[]
    connectOrCreate?: ParticipantCreateOrConnectWithoutJerseyInput | ParticipantCreateOrConnectWithoutJerseyInput[]
    createMany?: ParticipantCreateManyJerseyInputEnvelope
    connect?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
  }

  export type EventUpdateOneRequiredWithoutJerseysNestedInput = {
    create?: XOR<EventCreateWithoutJerseysInput, EventUncheckedCreateWithoutJerseysInput>
    connectOrCreate?: EventCreateOrConnectWithoutJerseysInput
    upsert?: EventUpsertWithoutJerseysInput
    connect?: EventWhereUniqueInput
    update?: XOR<XOR<EventUpdateToOneWithWhereWithoutJerseysInput, EventUpdateWithoutJerseysInput>, EventUncheckedUpdateWithoutJerseysInput>
  }

  export type ParticipantUpdateManyWithoutJerseyNestedInput = {
    create?: XOR<ParticipantCreateWithoutJerseyInput, ParticipantUncheckedCreateWithoutJerseyInput> | ParticipantCreateWithoutJerseyInput[] | ParticipantUncheckedCreateWithoutJerseyInput[]
    connectOrCreate?: ParticipantCreateOrConnectWithoutJerseyInput | ParticipantCreateOrConnectWithoutJerseyInput[]
    upsert?: ParticipantUpsertWithWhereUniqueWithoutJerseyInput | ParticipantUpsertWithWhereUniqueWithoutJerseyInput[]
    createMany?: ParticipantCreateManyJerseyInputEnvelope
    set?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
    disconnect?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
    delete?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
    connect?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
    update?: ParticipantUpdateWithWhereUniqueWithoutJerseyInput | ParticipantUpdateWithWhereUniqueWithoutJerseyInput[]
    updateMany?: ParticipantUpdateManyWithWhereWithoutJerseyInput | ParticipantUpdateManyWithWhereWithoutJerseyInput[]
    deleteMany?: ParticipantScalarWhereInput | ParticipantScalarWhereInput[]
  }

  export type ParticipantUncheckedUpdateManyWithoutJerseyNestedInput = {
    create?: XOR<ParticipantCreateWithoutJerseyInput, ParticipantUncheckedCreateWithoutJerseyInput> | ParticipantCreateWithoutJerseyInput[] | ParticipantUncheckedCreateWithoutJerseyInput[]
    connectOrCreate?: ParticipantCreateOrConnectWithoutJerseyInput | ParticipantCreateOrConnectWithoutJerseyInput[]
    upsert?: ParticipantUpsertWithWhereUniqueWithoutJerseyInput | ParticipantUpsertWithWhereUniqueWithoutJerseyInput[]
    createMany?: ParticipantCreateManyJerseyInputEnvelope
    set?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
    disconnect?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
    delete?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
    connect?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
    update?: ParticipantUpdateWithWhereUniqueWithoutJerseyInput | ParticipantUpdateWithWhereUniqueWithoutJerseyInput[]
    updateMany?: ParticipantUpdateManyWithWhereWithoutJerseyInput | ParticipantUpdateManyWithWhereWithoutJerseyInput[]
    deleteMany?: ParticipantScalarWhereInput | ParticipantScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutOrdersInput = {
    create?: XOR<UserCreateWithoutOrdersInput, UserUncheckedCreateWithoutOrdersInput>
    connectOrCreate?: UserCreateOrConnectWithoutOrdersInput
    connect?: UserWhereUniqueInput
  }

  export type ParticipantCreateNestedManyWithoutOrderInput = {
    create?: XOR<ParticipantCreateWithoutOrderInput, ParticipantUncheckedCreateWithoutOrderInput> | ParticipantCreateWithoutOrderInput[] | ParticipantUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: ParticipantCreateOrConnectWithoutOrderInput | ParticipantCreateOrConnectWithoutOrderInput[]
    createMany?: ParticipantCreateManyOrderInputEnvelope
    connect?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
  }

  export type QrTokenCreateNestedOneWithoutOrderInput = {
    create?: XOR<QrTokenCreateWithoutOrderInput, QrTokenUncheckedCreateWithoutOrderInput>
    connectOrCreate?: QrTokenCreateOrConnectWithoutOrderInput
    connect?: QrTokenWhereUniqueInput
  }

  export type ParticipantUncheckedCreateNestedManyWithoutOrderInput = {
    create?: XOR<ParticipantCreateWithoutOrderInput, ParticipantUncheckedCreateWithoutOrderInput> | ParticipantCreateWithoutOrderInput[] | ParticipantUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: ParticipantCreateOrConnectWithoutOrderInput | ParticipantCreateOrConnectWithoutOrderInput[]
    createMany?: ParticipantCreateManyOrderInputEnvelope
    connect?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
  }

  export type QrTokenUncheckedCreateNestedOneWithoutOrderInput = {
    create?: XOR<QrTokenCreateWithoutOrderInput, QrTokenUncheckedCreateWithoutOrderInput>
    connectOrCreate?: QrTokenCreateOrConnectWithoutOrderInput
    connect?: QrTokenWhereUniqueInput
  }

  export type EnumOrderStatusFieldUpdateOperationsInput = {
    set?: $Enums.OrderStatus
  }

  export type UserUpdateOneRequiredWithoutOrdersNestedInput = {
    create?: XOR<UserCreateWithoutOrdersInput, UserUncheckedCreateWithoutOrdersInput>
    connectOrCreate?: UserCreateOrConnectWithoutOrdersInput
    upsert?: UserUpsertWithoutOrdersInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutOrdersInput, UserUpdateWithoutOrdersInput>, UserUncheckedUpdateWithoutOrdersInput>
  }

  export type ParticipantUpdateManyWithoutOrderNestedInput = {
    create?: XOR<ParticipantCreateWithoutOrderInput, ParticipantUncheckedCreateWithoutOrderInput> | ParticipantCreateWithoutOrderInput[] | ParticipantUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: ParticipantCreateOrConnectWithoutOrderInput | ParticipantCreateOrConnectWithoutOrderInput[]
    upsert?: ParticipantUpsertWithWhereUniqueWithoutOrderInput | ParticipantUpsertWithWhereUniqueWithoutOrderInput[]
    createMany?: ParticipantCreateManyOrderInputEnvelope
    set?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
    disconnect?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
    delete?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
    connect?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
    update?: ParticipantUpdateWithWhereUniqueWithoutOrderInput | ParticipantUpdateWithWhereUniqueWithoutOrderInput[]
    updateMany?: ParticipantUpdateManyWithWhereWithoutOrderInput | ParticipantUpdateManyWithWhereWithoutOrderInput[]
    deleteMany?: ParticipantScalarWhereInput | ParticipantScalarWhereInput[]
  }

  export type QrTokenUpdateOneWithoutOrderNestedInput = {
    create?: XOR<QrTokenCreateWithoutOrderInput, QrTokenUncheckedCreateWithoutOrderInput>
    connectOrCreate?: QrTokenCreateOrConnectWithoutOrderInput
    upsert?: QrTokenUpsertWithoutOrderInput
    disconnect?: QrTokenWhereInput | boolean
    delete?: QrTokenWhereInput | boolean
    connect?: QrTokenWhereUniqueInput
    update?: XOR<XOR<QrTokenUpdateToOneWithWhereWithoutOrderInput, QrTokenUpdateWithoutOrderInput>, QrTokenUncheckedUpdateWithoutOrderInput>
  }

  export type ParticipantUncheckedUpdateManyWithoutOrderNestedInput = {
    create?: XOR<ParticipantCreateWithoutOrderInput, ParticipantUncheckedCreateWithoutOrderInput> | ParticipantCreateWithoutOrderInput[] | ParticipantUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: ParticipantCreateOrConnectWithoutOrderInput | ParticipantCreateOrConnectWithoutOrderInput[]
    upsert?: ParticipantUpsertWithWhereUniqueWithoutOrderInput | ParticipantUpsertWithWhereUniqueWithoutOrderInput[]
    createMany?: ParticipantCreateManyOrderInputEnvelope
    set?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
    disconnect?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
    delete?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
    connect?: ParticipantWhereUniqueInput | ParticipantWhereUniqueInput[]
    update?: ParticipantUpdateWithWhereUniqueWithoutOrderInput | ParticipantUpdateWithWhereUniqueWithoutOrderInput[]
    updateMany?: ParticipantUpdateManyWithWhereWithoutOrderInput | ParticipantUpdateManyWithWhereWithoutOrderInput[]
    deleteMany?: ParticipantScalarWhereInput | ParticipantScalarWhereInput[]
  }

  export type QrTokenUncheckedUpdateOneWithoutOrderNestedInput = {
    create?: XOR<QrTokenCreateWithoutOrderInput, QrTokenUncheckedCreateWithoutOrderInput>
    connectOrCreate?: QrTokenCreateOrConnectWithoutOrderInput
    upsert?: QrTokenUpsertWithoutOrderInput
    disconnect?: QrTokenWhereInput | boolean
    delete?: QrTokenWhereInput | boolean
    connect?: QrTokenWhereUniqueInput
    update?: XOR<XOR<QrTokenUpdateToOneWithWhereWithoutOrderInput, QrTokenUpdateWithoutOrderInput>, QrTokenUncheckedUpdateWithoutOrderInput>
  }

  export type OrderCreateNestedOneWithoutParticipantsInput = {
    create?: XOR<OrderCreateWithoutParticipantsInput, OrderUncheckedCreateWithoutParticipantsInput>
    connectOrCreate?: OrderCreateOrConnectWithoutParticipantsInput
    connect?: OrderWhereUniqueInput
  }

  export type EventCreateNestedOneWithoutParticipantsInput = {
    create?: XOR<EventCreateWithoutParticipantsInput, EventUncheckedCreateWithoutParticipantsInput>
    connectOrCreate?: EventCreateOrConnectWithoutParticipantsInput
    connect?: EventWhereUniqueInput
  }

  export type JerseyCreateNestedOneWithoutParticipantsInput = {
    create?: XOR<JerseyCreateWithoutParticipantsInput, JerseyUncheckedCreateWithoutParticipantsInput>
    connectOrCreate?: JerseyCreateOrConnectWithoutParticipantsInput
    connect?: JerseyWhereUniqueInput
  }

  export type QrTokenCreateNestedOneWithoutParticipantInput = {
    create?: XOR<QrTokenCreateWithoutParticipantInput, QrTokenUncheckedCreateWithoutParticipantInput>
    connectOrCreate?: QrTokenCreateOrConnectWithoutParticipantInput
    connect?: QrTokenWhereUniqueInput
  }

  export type QrTokenUncheckedCreateNestedOneWithoutParticipantInput = {
    create?: XOR<QrTokenCreateWithoutParticipantInput, QrTokenUncheckedCreateWithoutParticipantInput>
    connectOrCreate?: QrTokenCreateOrConnectWithoutParticipantInput
    connect?: QrTokenWhereUniqueInput
  }

  export type EnumGenderFieldUpdateOperationsInput = {
    set?: $Enums.Gender
  }

  export type EnumBloodTypeFieldUpdateOperationsInput = {
    set?: $Enums.BloodType
  }

  export type OrderUpdateOneRequiredWithoutParticipantsNestedInput = {
    create?: XOR<OrderCreateWithoutParticipantsInput, OrderUncheckedCreateWithoutParticipantsInput>
    connectOrCreate?: OrderCreateOrConnectWithoutParticipantsInput
    upsert?: OrderUpsertWithoutParticipantsInput
    connect?: OrderWhereUniqueInput
    update?: XOR<XOR<OrderUpdateToOneWithWhereWithoutParticipantsInput, OrderUpdateWithoutParticipantsInput>, OrderUncheckedUpdateWithoutParticipantsInput>
  }

  export type EventUpdateOneRequiredWithoutParticipantsNestedInput = {
    create?: XOR<EventCreateWithoutParticipantsInput, EventUncheckedCreateWithoutParticipantsInput>
    connectOrCreate?: EventCreateOrConnectWithoutParticipantsInput
    upsert?: EventUpsertWithoutParticipantsInput
    connect?: EventWhereUniqueInput
    update?: XOR<XOR<EventUpdateToOneWithWhereWithoutParticipantsInput, EventUpdateWithoutParticipantsInput>, EventUncheckedUpdateWithoutParticipantsInput>
  }

  export type JerseyUpdateOneWithoutParticipantsNestedInput = {
    create?: XOR<JerseyCreateWithoutParticipantsInput, JerseyUncheckedCreateWithoutParticipantsInput>
    connectOrCreate?: JerseyCreateOrConnectWithoutParticipantsInput
    upsert?: JerseyUpsertWithoutParticipantsInput
    disconnect?: JerseyWhereInput | boolean
    delete?: JerseyWhereInput | boolean
    connect?: JerseyWhereUniqueInput
    update?: XOR<XOR<JerseyUpdateToOneWithWhereWithoutParticipantsInput, JerseyUpdateWithoutParticipantsInput>, JerseyUncheckedUpdateWithoutParticipantsInput>
  }

  export type QrTokenUpdateOneWithoutParticipantNestedInput = {
    create?: XOR<QrTokenCreateWithoutParticipantInput, QrTokenUncheckedCreateWithoutParticipantInput>
    connectOrCreate?: QrTokenCreateOrConnectWithoutParticipantInput
    upsert?: QrTokenUpsertWithoutParticipantInput
    disconnect?: QrTokenWhereInput | boolean
    delete?: QrTokenWhereInput | boolean
    connect?: QrTokenWhereUniqueInput
    update?: XOR<XOR<QrTokenUpdateToOneWithWhereWithoutParticipantInput, QrTokenUpdateWithoutParticipantInput>, QrTokenUncheckedUpdateWithoutParticipantInput>
  }

  export type QrTokenUncheckedUpdateOneWithoutParticipantNestedInput = {
    create?: XOR<QrTokenCreateWithoutParticipantInput, QrTokenUncheckedCreateWithoutParticipantInput>
    connectOrCreate?: QrTokenCreateOrConnectWithoutParticipantInput
    upsert?: QrTokenUpsertWithoutParticipantInput
    disconnect?: QrTokenWhereInput | boolean
    delete?: QrTokenWhereInput | boolean
    connect?: QrTokenWhereUniqueInput
    update?: XOR<XOR<QrTokenUpdateToOneWithWhereWithoutParticipantInput, QrTokenUpdateWithoutParticipantInput>, QrTokenUncheckedUpdateWithoutParticipantInput>
  }

  export type ParticipantCreateNestedOneWithoutQrTokenInput = {
    create?: XOR<ParticipantCreateWithoutQrTokenInput, ParticipantUncheckedCreateWithoutQrTokenInput>
    connectOrCreate?: ParticipantCreateOrConnectWithoutQrTokenInput
    connect?: ParticipantWhereUniqueInput
  }

  export type OrderCreateNestedOneWithoutMasterQrTokenInput = {
    create?: XOR<OrderCreateWithoutMasterQrTokenInput, OrderUncheckedCreateWithoutMasterQrTokenInput>
    connectOrCreate?: OrderCreateOrConnectWithoutMasterQrTokenInput
    connect?: OrderWhereUniqueInput
  }

  export type ParticipantUpdateOneWithoutQrTokenNestedInput = {
    create?: XOR<ParticipantCreateWithoutQrTokenInput, ParticipantUncheckedCreateWithoutQrTokenInput>
    connectOrCreate?: ParticipantCreateOrConnectWithoutQrTokenInput
    upsert?: ParticipantUpsertWithoutQrTokenInput
    disconnect?: ParticipantWhereInput | boolean
    delete?: ParticipantWhereInput | boolean
    connect?: ParticipantWhereUniqueInput
    update?: XOR<XOR<ParticipantUpdateToOneWithWhereWithoutQrTokenInput, ParticipantUpdateWithoutQrTokenInput>, ParticipantUncheckedUpdateWithoutQrTokenInput>
  }

  export type OrderUpdateOneWithoutMasterQrTokenNestedInput = {
    create?: XOR<OrderCreateWithoutMasterQrTokenInput, OrderUncheckedCreateWithoutMasterQrTokenInput>
    connectOrCreate?: OrderCreateOrConnectWithoutMasterQrTokenInput
    upsert?: OrderUpsertWithoutMasterQrTokenInput
    disconnect?: OrderWhereInput | boolean
    delete?: OrderWhereInput | boolean
    connect?: OrderWhereUniqueInput
    update?: XOR<XOR<OrderUpdateToOneWithWhereWithoutMasterQrTokenInput, OrderUpdateWithoutMasterQrTokenInput>, OrderUncheckedUpdateWithoutMasterQrTokenInput>
  }

  export type UserCreateNestedOneWithoutLogsInput = {
    create?: XOR<UserCreateWithoutLogsInput, UserUncheckedCreateWithoutLogsInput>
    connectOrCreate?: UserCreateOrConnectWithoutLogsInput
    connect?: UserWhereUniqueInput
  }

  export type AdminCreateNestedOneWithoutLogsInput = {
    create?: XOR<AdminCreateWithoutLogsInput, AdminUncheckedCreateWithoutLogsInput>
    connectOrCreate?: AdminCreateOrConnectWithoutLogsInput
    connect?: AdminWhereUniqueInput
  }

  export type UserUpdateOneWithoutLogsNestedInput = {
    create?: XOR<UserCreateWithoutLogsInput, UserUncheckedCreateWithoutLogsInput>
    connectOrCreate?: UserCreateOrConnectWithoutLogsInput
    upsert?: UserUpsertWithoutLogsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutLogsInput, UserUpdateWithoutLogsInput>, UserUncheckedUpdateWithoutLogsInput>
  }

  export type AdminUpdateOneWithoutLogsNestedInput = {
    create?: XOR<AdminCreateWithoutLogsInput, AdminUncheckedCreateWithoutLogsInput>
    connectOrCreate?: AdminCreateOrConnectWithoutLogsInput
    upsert?: AdminUpsertWithoutLogsInput
    disconnect?: AdminWhereInput | boolean
    delete?: AdminWhereInput | boolean
    connect?: AdminWhereUniqueInput
    update?: XOR<XOR<AdminUpdateToOneWithWhereWithoutLogsInput, AdminUpdateWithoutLogsInput>, AdminUncheckedUpdateWithoutLogsInput>
  }

  export type EventCreateNestedOneWithoutBibConfigInput = {
    create?: XOR<EventCreateWithoutBibConfigInput, EventUncheckedCreateWithoutBibConfigInput>
    connectOrCreate?: EventCreateOrConnectWithoutBibConfigInput
    connect?: EventWhereUniqueInput
  }

  export type EventUpdateOneRequiredWithoutBibConfigNestedInput = {
    create?: XOR<EventCreateWithoutBibConfigInput, EventUncheckedCreateWithoutBibConfigInput>
    connectOrCreate?: EventCreateOrConnectWithoutBibConfigInput
    upsert?: EventUpsertWithoutBibConfigInput
    connect?: EventWhereUniqueInput
    update?: XOR<XOR<EventUpdateToOneWithWhereWithoutBibConfigInput, EventUpdateWithoutBibConfigInput>, EventUncheckedUpdateWithoutBibConfigInput>
  }

  export type AdminCreateNestedManyWithoutRoleInput = {
    create?: XOR<AdminCreateWithoutRoleInput, AdminUncheckedCreateWithoutRoleInput> | AdminCreateWithoutRoleInput[] | AdminUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: AdminCreateOrConnectWithoutRoleInput | AdminCreateOrConnectWithoutRoleInput[]
    createMany?: AdminCreateManyRoleInputEnvelope
    connect?: AdminWhereUniqueInput | AdminWhereUniqueInput[]
  }

  export type AdminUncheckedCreateNestedManyWithoutRoleInput = {
    create?: XOR<AdminCreateWithoutRoleInput, AdminUncheckedCreateWithoutRoleInput> | AdminCreateWithoutRoleInput[] | AdminUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: AdminCreateOrConnectWithoutRoleInput | AdminCreateOrConnectWithoutRoleInput[]
    createMany?: AdminCreateManyRoleInputEnvelope
    connect?: AdminWhereUniqueInput | AdminWhereUniqueInput[]
  }

  export type AdminUpdateManyWithoutRoleNestedInput = {
    create?: XOR<AdminCreateWithoutRoleInput, AdminUncheckedCreateWithoutRoleInput> | AdminCreateWithoutRoleInput[] | AdminUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: AdminCreateOrConnectWithoutRoleInput | AdminCreateOrConnectWithoutRoleInput[]
    upsert?: AdminUpsertWithWhereUniqueWithoutRoleInput | AdminUpsertWithWhereUniqueWithoutRoleInput[]
    createMany?: AdminCreateManyRoleInputEnvelope
    set?: AdminWhereUniqueInput | AdminWhereUniqueInput[]
    disconnect?: AdminWhereUniqueInput | AdminWhereUniqueInput[]
    delete?: AdminWhereUniqueInput | AdminWhereUniqueInput[]
    connect?: AdminWhereUniqueInput | AdminWhereUniqueInput[]
    update?: AdminUpdateWithWhereUniqueWithoutRoleInput | AdminUpdateWithWhereUniqueWithoutRoleInput[]
    updateMany?: AdminUpdateManyWithWhereWithoutRoleInput | AdminUpdateManyWithWhereWithoutRoleInput[]
    deleteMany?: AdminScalarWhereInput | AdminScalarWhereInput[]
  }

  export type AdminUncheckedUpdateManyWithoutRoleNestedInput = {
    create?: XOR<AdminCreateWithoutRoleInput, AdminUncheckedCreateWithoutRoleInput> | AdminCreateWithoutRoleInput[] | AdminUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: AdminCreateOrConnectWithoutRoleInput | AdminCreateOrConnectWithoutRoleInput[]
    upsert?: AdminUpsertWithWhereUniqueWithoutRoleInput | AdminUpsertWithWhereUniqueWithoutRoleInput[]
    createMany?: AdminCreateManyRoleInputEnvelope
    set?: AdminWhereUniqueInput | AdminWhereUniqueInput[]
    disconnect?: AdminWhereUniqueInput | AdminWhereUniqueInput[]
    delete?: AdminWhereUniqueInput | AdminWhereUniqueInput[]
    connect?: AdminWhereUniqueInput | AdminWhereUniqueInput[]
    update?: AdminUpdateWithWhereUniqueWithoutRoleInput | AdminUpdateWithWhereUniqueWithoutRoleInput[]
    updateMany?: AdminUpdateManyWithWhereWithoutRoleInput | AdminUpdateManyWithWhereWithoutRoleInput[]
    deleteMany?: AdminScalarWhereInput | AdminScalarWhereInput[]
  }

  export type RoleCreateNestedOneWithoutAdminsInput = {
    create?: XOR<RoleCreateWithoutAdminsInput, RoleUncheckedCreateWithoutAdminsInput>
    connectOrCreate?: RoleCreateOrConnectWithoutAdminsInput
    connect?: RoleWhereUniqueInput
  }

  export type LogCreateNestedManyWithoutAdminInput = {
    create?: XOR<LogCreateWithoutAdminInput, LogUncheckedCreateWithoutAdminInput> | LogCreateWithoutAdminInput[] | LogUncheckedCreateWithoutAdminInput[]
    connectOrCreate?: LogCreateOrConnectWithoutAdminInput | LogCreateOrConnectWithoutAdminInput[]
    createMany?: LogCreateManyAdminInputEnvelope
    connect?: LogWhereUniqueInput | LogWhereUniqueInput[]
  }

  export type LogUncheckedCreateNestedManyWithoutAdminInput = {
    create?: XOR<LogCreateWithoutAdminInput, LogUncheckedCreateWithoutAdminInput> | LogCreateWithoutAdminInput[] | LogUncheckedCreateWithoutAdminInput[]
    connectOrCreate?: LogCreateOrConnectWithoutAdminInput | LogCreateOrConnectWithoutAdminInput[]
    createMany?: LogCreateManyAdminInputEnvelope
    connect?: LogWhereUniqueInput | LogWhereUniqueInput[]
  }

  export type RoleUpdateOneRequiredWithoutAdminsNestedInput = {
    create?: XOR<RoleCreateWithoutAdminsInput, RoleUncheckedCreateWithoutAdminsInput>
    connectOrCreate?: RoleCreateOrConnectWithoutAdminsInput
    upsert?: RoleUpsertWithoutAdminsInput
    connect?: RoleWhereUniqueInput
    update?: XOR<XOR<RoleUpdateToOneWithWhereWithoutAdminsInput, RoleUpdateWithoutAdminsInput>, RoleUncheckedUpdateWithoutAdminsInput>
  }

  export type LogUpdateManyWithoutAdminNestedInput = {
    create?: XOR<LogCreateWithoutAdminInput, LogUncheckedCreateWithoutAdminInput> | LogCreateWithoutAdminInput[] | LogUncheckedCreateWithoutAdminInput[]
    connectOrCreate?: LogCreateOrConnectWithoutAdminInput | LogCreateOrConnectWithoutAdminInput[]
    upsert?: LogUpsertWithWhereUniqueWithoutAdminInput | LogUpsertWithWhereUniqueWithoutAdminInput[]
    createMany?: LogCreateManyAdminInputEnvelope
    set?: LogWhereUniqueInput | LogWhereUniqueInput[]
    disconnect?: LogWhereUniqueInput | LogWhereUniqueInput[]
    delete?: LogWhereUniqueInput | LogWhereUniqueInput[]
    connect?: LogWhereUniqueInput | LogWhereUniqueInput[]
    update?: LogUpdateWithWhereUniqueWithoutAdminInput | LogUpdateWithWhereUniqueWithoutAdminInput[]
    updateMany?: LogUpdateManyWithWhereWithoutAdminInput | LogUpdateManyWithWhereWithoutAdminInput[]
    deleteMany?: LogScalarWhereInput | LogScalarWhereInput[]
  }

  export type LogUncheckedUpdateManyWithoutAdminNestedInput = {
    create?: XOR<LogCreateWithoutAdminInput, LogUncheckedCreateWithoutAdminInput> | LogCreateWithoutAdminInput[] | LogUncheckedCreateWithoutAdminInput[]
    connectOrCreate?: LogCreateOrConnectWithoutAdminInput | LogCreateOrConnectWithoutAdminInput[]
    upsert?: LogUpsertWithWhereUniqueWithoutAdminInput | LogUpsertWithWhereUniqueWithoutAdminInput[]
    createMany?: LogCreateManyAdminInputEnvelope
    set?: LogWhereUniqueInput | LogWhereUniqueInput[]
    disconnect?: LogWhereUniqueInput | LogWhereUniqueInput[]
    delete?: LogWhereUniqueInput | LogWhereUniqueInput[]
    connect?: LogWhereUniqueInput | LogWhereUniqueInput[]
    update?: LogUpdateWithWhereUniqueWithoutAdminInput | LogUpdateWithWhereUniqueWithoutAdminInput[]
    updateMany?: LogUpdateManyWithWhereWithoutAdminInput | LogUpdateManyWithWhereWithoutAdminInput[]
    deleteMany?: LogScalarWhereInput | LogScalarWhereInput[]
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumOrderStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.OrderStatus | EnumOrderStatusFieldRefInput<$PrismaModel>
    in?: $Enums.OrderStatus[] | ListEnumOrderStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.OrderStatus[] | ListEnumOrderStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumOrderStatusFilter<$PrismaModel> | $Enums.OrderStatus
  }

  export type NestedEnumOrderStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.OrderStatus | EnumOrderStatusFieldRefInput<$PrismaModel>
    in?: $Enums.OrderStatus[] | ListEnumOrderStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.OrderStatus[] | ListEnumOrderStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumOrderStatusWithAggregatesFilter<$PrismaModel> | $Enums.OrderStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumOrderStatusFilter<$PrismaModel>
    _max?: NestedEnumOrderStatusFilter<$PrismaModel>
  }

  export type NestedEnumGenderFilter<$PrismaModel = never> = {
    equals?: $Enums.Gender | EnumGenderFieldRefInput<$PrismaModel>
    in?: $Enums.Gender[] | ListEnumGenderFieldRefInput<$PrismaModel>
    notIn?: $Enums.Gender[] | ListEnumGenderFieldRefInput<$PrismaModel>
    not?: NestedEnumGenderFilter<$PrismaModel> | $Enums.Gender
  }

  export type NestedEnumBloodTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.BloodType | EnumBloodTypeFieldRefInput<$PrismaModel>
    in?: $Enums.BloodType[] | ListEnumBloodTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.BloodType[] | ListEnumBloodTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumBloodTypeFilter<$PrismaModel> | $Enums.BloodType
  }

  export type NestedEnumGenderWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Gender | EnumGenderFieldRefInput<$PrismaModel>
    in?: $Enums.Gender[] | ListEnumGenderFieldRefInput<$PrismaModel>
    notIn?: $Enums.Gender[] | ListEnumGenderFieldRefInput<$PrismaModel>
    not?: NestedEnumGenderWithAggregatesFilter<$PrismaModel> | $Enums.Gender
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumGenderFilter<$PrismaModel>
    _max?: NestedEnumGenderFilter<$PrismaModel>
  }

  export type NestedEnumBloodTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BloodType | EnumBloodTypeFieldRefInput<$PrismaModel>
    in?: $Enums.BloodType[] | ListEnumBloodTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.BloodType[] | ListEnumBloodTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumBloodTypeWithAggregatesFilter<$PrismaModel> | $Enums.BloodType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBloodTypeFilter<$PrismaModel>
    _max?: NestedEnumBloodTypeFilter<$PrismaModel>
  }

  export type OrderCreateWithoutUserInput = {
    id?: string
    totalAmount: Decimal | DecimalJsLike | number | string
    status?: $Enums.OrderStatus
    midtransOrderId?: string | null
    snapToken?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    participants?: ParticipantCreateNestedManyWithoutOrderInput
    masterQrToken?: QrTokenCreateNestedOneWithoutOrderInput
  }

  export type OrderUncheckedCreateWithoutUserInput = {
    id?: string
    totalAmount: Decimal | DecimalJsLike | number | string
    status?: $Enums.OrderStatus
    midtransOrderId?: string | null
    snapToken?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    participants?: ParticipantUncheckedCreateNestedManyWithoutOrderInput
    masterQrToken?: QrTokenUncheckedCreateNestedOneWithoutOrderInput
  }

  export type OrderCreateOrConnectWithoutUserInput = {
    where: OrderWhereUniqueInput
    create: XOR<OrderCreateWithoutUserInput, OrderUncheckedCreateWithoutUserInput>
  }

  export type OrderCreateManyUserInputEnvelope = {
    data: OrderCreateManyUserInput | OrderCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type LogCreateWithoutUserInput = {
    id?: string
    action: string
    description: string
    entityType?: string | null
    entityId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    admin?: AdminCreateNestedOneWithoutLogsInput
  }

  export type LogUncheckedCreateWithoutUserInput = {
    id?: string
    action: string
    description: string
    adminId?: string | null
    entityType?: string | null
    entityId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type LogCreateOrConnectWithoutUserInput = {
    where: LogWhereUniqueInput
    create: XOR<LogCreateWithoutUserInput, LogUncheckedCreateWithoutUserInput>
  }

  export type LogCreateManyUserInputEnvelope = {
    data: LogCreateManyUserInput | LogCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type OrderUpsertWithWhereUniqueWithoutUserInput = {
    where: OrderWhereUniqueInput
    update: XOR<OrderUpdateWithoutUserInput, OrderUncheckedUpdateWithoutUserInput>
    create: XOR<OrderCreateWithoutUserInput, OrderUncheckedCreateWithoutUserInput>
  }

  export type OrderUpdateWithWhereUniqueWithoutUserInput = {
    where: OrderWhereUniqueInput
    data: XOR<OrderUpdateWithoutUserInput, OrderUncheckedUpdateWithoutUserInput>
  }

  export type OrderUpdateManyWithWhereWithoutUserInput = {
    where: OrderScalarWhereInput
    data: XOR<OrderUpdateManyMutationInput, OrderUncheckedUpdateManyWithoutUserInput>
  }

  export type OrderScalarWhereInput = {
    AND?: OrderScalarWhereInput | OrderScalarWhereInput[]
    OR?: OrderScalarWhereInput[]
    NOT?: OrderScalarWhereInput | OrderScalarWhereInput[]
    id?: StringFilter<"Order"> | string
    userId?: StringFilter<"Order"> | string
    totalAmount?: DecimalFilter<"Order"> | Decimal | DecimalJsLike | number | string
    status?: EnumOrderStatusFilter<"Order"> | $Enums.OrderStatus
    midtransOrderId?: StringNullableFilter<"Order"> | string | null
    snapToken?: StringNullableFilter<"Order"> | string | null
    createdAt?: DateTimeFilter<"Order"> | Date | string
    updatedAt?: DateTimeFilter<"Order"> | Date | string
  }

  export type LogUpsertWithWhereUniqueWithoutUserInput = {
    where: LogWhereUniqueInput
    update: XOR<LogUpdateWithoutUserInput, LogUncheckedUpdateWithoutUserInput>
    create: XOR<LogCreateWithoutUserInput, LogUncheckedCreateWithoutUserInput>
  }

  export type LogUpdateWithWhereUniqueWithoutUserInput = {
    where: LogWhereUniqueInput
    data: XOR<LogUpdateWithoutUserInput, LogUncheckedUpdateWithoutUserInput>
  }

  export type LogUpdateManyWithWhereWithoutUserInput = {
    where: LogScalarWhereInput
    data: XOR<LogUpdateManyMutationInput, LogUncheckedUpdateManyWithoutUserInput>
  }

  export type LogScalarWhereInput = {
    AND?: LogScalarWhereInput | LogScalarWhereInput[]
    OR?: LogScalarWhereInput[]
    NOT?: LogScalarWhereInput | LogScalarWhereInput[]
    id?: StringFilter<"Log"> | string
    action?: StringFilter<"Log"> | string
    description?: StringFilter<"Log"> | string
    userId?: StringNullableFilter<"Log"> | string | null
    adminId?: StringNullableFilter<"Log"> | string | null
    entityType?: StringNullableFilter<"Log"> | string | null
    entityId?: StringNullableFilter<"Log"> | string | null
    metadata?: JsonNullableFilter<"Log">
    createdAt?: DateTimeFilter<"Log"> | Date | string
  }

  export type ParticipantCreateWithoutEventInput = {
    id?: string
    fullNameKtp: string
    bibName: string
    phoneNumber?: string | null
    nik: string
    gender: $Enums.Gender
    birthPlace: string
    birthDate: Date | string
    fullAddress: string
    country?: string
    bloodType: $Enums.BloodType
    medicalHistory?: string | null
    emergencyContactName: string
    emergencyContactPhone: string
    selectedSize?: string | null
    communityName?: string | null
    bibNumber?: string | null
    createdAt?: Date | string
    order: OrderCreateNestedOneWithoutParticipantsInput
    jersey?: JerseyCreateNestedOneWithoutParticipantsInput
    qrToken?: QrTokenCreateNestedOneWithoutParticipantInput
  }

  export type ParticipantUncheckedCreateWithoutEventInput = {
    id?: string
    orderId: string
    fullNameKtp: string
    bibName: string
    phoneNumber?: string | null
    nik: string
    gender: $Enums.Gender
    birthPlace: string
    birthDate: Date | string
    fullAddress: string
    country?: string
    bloodType: $Enums.BloodType
    medicalHistory?: string | null
    emergencyContactName: string
    emergencyContactPhone: string
    jerseyId?: string | null
    selectedSize?: string | null
    communityName?: string | null
    bibNumber?: string | null
    createdAt?: Date | string
    qrToken?: QrTokenUncheckedCreateNestedOneWithoutParticipantInput
  }

  export type ParticipantCreateOrConnectWithoutEventInput = {
    where: ParticipantWhereUniqueInput
    create: XOR<ParticipantCreateWithoutEventInput, ParticipantUncheckedCreateWithoutEventInput>
  }

  export type ParticipantCreateManyEventInputEnvelope = {
    data: ParticipantCreateManyEventInput | ParticipantCreateManyEventInput[]
    skipDuplicates?: boolean
  }

  export type EventBenefitCreateWithoutEventInput = {
    id?: string
    name: string
    description: string
    image?: string | null
  }

  export type EventBenefitUncheckedCreateWithoutEventInput = {
    id?: string
    name: string
    description: string
    image?: string | null
  }

  export type EventBenefitCreateOrConnectWithoutEventInput = {
    where: EventBenefitWhereUniqueInput
    create: XOR<EventBenefitCreateWithoutEventInput, EventBenefitUncheckedCreateWithoutEventInput>
  }

  export type EventBenefitCreateManyEventInputEnvelope = {
    data: EventBenefitCreateManyEventInput | EventBenefitCreateManyEventInput[]
    skipDuplicates?: boolean
  }

  export type JerseyCreateWithoutEventInput = {
    id?: string
    name: string
    type: string
    sizes: JsonNullValueInput | InputJsonValue
    image?: string | null
    bannerImages?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    participants?: ParticipantCreateNestedManyWithoutJerseyInput
  }

  export type JerseyUncheckedCreateWithoutEventInput = {
    id?: string
    name: string
    type: string
    sizes: JsonNullValueInput | InputJsonValue
    image?: string | null
    bannerImages?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    participants?: ParticipantUncheckedCreateNestedManyWithoutJerseyInput
  }

  export type JerseyCreateOrConnectWithoutEventInput = {
    where: JerseyWhereUniqueInput
    create: XOR<JerseyCreateWithoutEventInput, JerseyUncheckedCreateWithoutEventInput>
  }

  export type JerseyCreateManyEventInputEnvelope = {
    data: JerseyCreateManyEventInput | JerseyCreateManyEventInput[]
    skipDuplicates?: boolean
  }

  export type BibConfigurationCreateWithoutEventInput = {
    id?: string
    prefix: string
    digitLength: number
    startNumber?: number
    suffix?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BibConfigurationUncheckedCreateWithoutEventInput = {
    id?: string
    prefix: string
    digitLength: number
    startNumber?: number
    suffix?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BibConfigurationCreateOrConnectWithoutEventInput = {
    where: BibConfigurationWhereUniqueInput
    create: XOR<BibConfigurationCreateWithoutEventInput, BibConfigurationUncheckedCreateWithoutEventInput>
  }

  export type ParticipantUpsertWithWhereUniqueWithoutEventInput = {
    where: ParticipantWhereUniqueInput
    update: XOR<ParticipantUpdateWithoutEventInput, ParticipantUncheckedUpdateWithoutEventInput>
    create: XOR<ParticipantCreateWithoutEventInput, ParticipantUncheckedCreateWithoutEventInput>
  }

  export type ParticipantUpdateWithWhereUniqueWithoutEventInput = {
    where: ParticipantWhereUniqueInput
    data: XOR<ParticipantUpdateWithoutEventInput, ParticipantUncheckedUpdateWithoutEventInput>
  }

  export type ParticipantUpdateManyWithWhereWithoutEventInput = {
    where: ParticipantScalarWhereInput
    data: XOR<ParticipantUpdateManyMutationInput, ParticipantUncheckedUpdateManyWithoutEventInput>
  }

  export type ParticipantScalarWhereInput = {
    AND?: ParticipantScalarWhereInput | ParticipantScalarWhereInput[]
    OR?: ParticipantScalarWhereInput[]
    NOT?: ParticipantScalarWhereInput | ParticipantScalarWhereInput[]
    id?: StringFilter<"Participant"> | string
    orderId?: StringFilter<"Participant"> | string
    eventId?: StringFilter<"Participant"> | string
    fullNameKtp?: StringFilter<"Participant"> | string
    bibName?: StringFilter<"Participant"> | string
    phoneNumber?: StringNullableFilter<"Participant"> | string | null
    nik?: StringFilter<"Participant"> | string
    gender?: EnumGenderFilter<"Participant"> | $Enums.Gender
    birthPlace?: StringFilter<"Participant"> | string
    birthDate?: DateTimeFilter<"Participant"> | Date | string
    fullAddress?: StringFilter<"Participant"> | string
    country?: StringFilter<"Participant"> | string
    bloodType?: EnumBloodTypeFilter<"Participant"> | $Enums.BloodType
    medicalHistory?: StringNullableFilter<"Participant"> | string | null
    emergencyContactName?: StringFilter<"Participant"> | string
    emergencyContactPhone?: StringFilter<"Participant"> | string
    jerseyId?: StringNullableFilter<"Participant"> | string | null
    selectedSize?: StringNullableFilter<"Participant"> | string | null
    communityName?: StringNullableFilter<"Participant"> | string | null
    bibNumber?: StringNullableFilter<"Participant"> | string | null
    createdAt?: DateTimeFilter<"Participant"> | Date | string
  }

  export type EventBenefitUpsertWithWhereUniqueWithoutEventInput = {
    where: EventBenefitWhereUniqueInput
    update: XOR<EventBenefitUpdateWithoutEventInput, EventBenefitUncheckedUpdateWithoutEventInput>
    create: XOR<EventBenefitCreateWithoutEventInput, EventBenefitUncheckedCreateWithoutEventInput>
  }

  export type EventBenefitUpdateWithWhereUniqueWithoutEventInput = {
    where: EventBenefitWhereUniqueInput
    data: XOR<EventBenefitUpdateWithoutEventInput, EventBenefitUncheckedUpdateWithoutEventInput>
  }

  export type EventBenefitUpdateManyWithWhereWithoutEventInput = {
    where: EventBenefitScalarWhereInput
    data: XOR<EventBenefitUpdateManyMutationInput, EventBenefitUncheckedUpdateManyWithoutEventInput>
  }

  export type EventBenefitScalarWhereInput = {
    AND?: EventBenefitScalarWhereInput | EventBenefitScalarWhereInput[]
    OR?: EventBenefitScalarWhereInput[]
    NOT?: EventBenefitScalarWhereInput | EventBenefitScalarWhereInput[]
    id?: StringFilter<"EventBenefit"> | string
    eventId?: StringFilter<"EventBenefit"> | string
    name?: StringFilter<"EventBenefit"> | string
    description?: StringFilter<"EventBenefit"> | string
    image?: StringNullableFilter<"EventBenefit"> | string | null
  }

  export type JerseyUpsertWithWhereUniqueWithoutEventInput = {
    where: JerseyWhereUniqueInput
    update: XOR<JerseyUpdateWithoutEventInput, JerseyUncheckedUpdateWithoutEventInput>
    create: XOR<JerseyCreateWithoutEventInput, JerseyUncheckedCreateWithoutEventInput>
  }

  export type JerseyUpdateWithWhereUniqueWithoutEventInput = {
    where: JerseyWhereUniqueInput
    data: XOR<JerseyUpdateWithoutEventInput, JerseyUncheckedUpdateWithoutEventInput>
  }

  export type JerseyUpdateManyWithWhereWithoutEventInput = {
    where: JerseyScalarWhereInput
    data: XOR<JerseyUpdateManyMutationInput, JerseyUncheckedUpdateManyWithoutEventInput>
  }

  export type JerseyScalarWhereInput = {
    AND?: JerseyScalarWhereInput | JerseyScalarWhereInput[]
    OR?: JerseyScalarWhereInput[]
    NOT?: JerseyScalarWhereInput | JerseyScalarWhereInput[]
    id?: StringFilter<"Jersey"> | string
    eventId?: StringFilter<"Jersey"> | string
    name?: StringFilter<"Jersey"> | string
    type?: StringFilter<"Jersey"> | string
    sizes?: JsonFilter<"Jersey">
    image?: StringNullableFilter<"Jersey"> | string | null
    bannerImages?: JsonNullableFilter<"Jersey">
    createdAt?: DateTimeFilter<"Jersey"> | Date | string
    updatedAt?: DateTimeFilter<"Jersey"> | Date | string
  }

  export type BibConfigurationUpsertWithoutEventInput = {
    update: XOR<BibConfigurationUpdateWithoutEventInput, BibConfigurationUncheckedUpdateWithoutEventInput>
    create: XOR<BibConfigurationCreateWithoutEventInput, BibConfigurationUncheckedCreateWithoutEventInput>
    where?: BibConfigurationWhereInput
  }

  export type BibConfigurationUpdateToOneWithWhereWithoutEventInput = {
    where?: BibConfigurationWhereInput
    data: XOR<BibConfigurationUpdateWithoutEventInput, BibConfigurationUncheckedUpdateWithoutEventInput>
  }

  export type BibConfigurationUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    prefix?: StringFieldUpdateOperationsInput | string
    digitLength?: IntFieldUpdateOperationsInput | number
    startNumber?: IntFieldUpdateOperationsInput | number
    suffix?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BibConfigurationUncheckedUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    prefix?: StringFieldUpdateOperationsInput | string
    digitLength?: IntFieldUpdateOperationsInput | number
    startNumber?: IntFieldUpdateOperationsInput | number
    suffix?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventCreateWithoutBenefitsInput = {
    id?: string
    ticketName: string
    category: string
    stock: number
    price: Decimal | DecimalJsLike | number | string
    ticketImage?: string | null
    medalImage?: string | null
    eventDate?: Date | string | null
    followGlobalTimer?: boolean
    isClosed?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    participants?: ParticipantCreateNestedManyWithoutEventInput
    jerseys?: JerseyCreateNestedManyWithoutEventInput
    bibConfig?: BibConfigurationCreateNestedOneWithoutEventInput
  }

  export type EventUncheckedCreateWithoutBenefitsInput = {
    id?: string
    ticketName: string
    category: string
    stock: number
    price: Decimal | DecimalJsLike | number | string
    ticketImage?: string | null
    medalImage?: string | null
    eventDate?: Date | string | null
    followGlobalTimer?: boolean
    isClosed?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    participants?: ParticipantUncheckedCreateNestedManyWithoutEventInput
    jerseys?: JerseyUncheckedCreateNestedManyWithoutEventInput
    bibConfig?: BibConfigurationUncheckedCreateNestedOneWithoutEventInput
  }

  export type EventCreateOrConnectWithoutBenefitsInput = {
    where: EventWhereUniqueInput
    create: XOR<EventCreateWithoutBenefitsInput, EventUncheckedCreateWithoutBenefitsInput>
  }

  export type EventUpsertWithoutBenefitsInput = {
    update: XOR<EventUpdateWithoutBenefitsInput, EventUncheckedUpdateWithoutBenefitsInput>
    create: XOR<EventCreateWithoutBenefitsInput, EventUncheckedCreateWithoutBenefitsInput>
    where?: EventWhereInput
  }

  export type EventUpdateToOneWithWhereWithoutBenefitsInput = {
    where?: EventWhereInput
    data: XOR<EventUpdateWithoutBenefitsInput, EventUncheckedUpdateWithoutBenefitsInput>
  }

  export type EventUpdateWithoutBenefitsInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticketName?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    stock?: IntFieldUpdateOperationsInput | number
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    ticketImage?: NullableStringFieldUpdateOperationsInput | string | null
    medalImage?: NullableStringFieldUpdateOperationsInput | string | null
    eventDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    followGlobalTimer?: BoolFieldUpdateOperationsInput | boolean
    isClosed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: ParticipantUpdateManyWithoutEventNestedInput
    jerseys?: JerseyUpdateManyWithoutEventNestedInput
    bibConfig?: BibConfigurationUpdateOneWithoutEventNestedInput
  }

  export type EventUncheckedUpdateWithoutBenefitsInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticketName?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    stock?: IntFieldUpdateOperationsInput | number
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    ticketImage?: NullableStringFieldUpdateOperationsInput | string | null
    medalImage?: NullableStringFieldUpdateOperationsInput | string | null
    eventDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    followGlobalTimer?: BoolFieldUpdateOperationsInput | boolean
    isClosed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: ParticipantUncheckedUpdateManyWithoutEventNestedInput
    jerseys?: JerseyUncheckedUpdateManyWithoutEventNestedInput
    bibConfig?: BibConfigurationUncheckedUpdateOneWithoutEventNestedInput
  }

  export type EventCreateWithoutJerseysInput = {
    id?: string
    ticketName: string
    category: string
    stock: number
    price: Decimal | DecimalJsLike | number | string
    ticketImage?: string | null
    medalImage?: string | null
    eventDate?: Date | string | null
    followGlobalTimer?: boolean
    isClosed?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    participants?: ParticipantCreateNestedManyWithoutEventInput
    benefits?: EventBenefitCreateNestedManyWithoutEventInput
    bibConfig?: BibConfigurationCreateNestedOneWithoutEventInput
  }

  export type EventUncheckedCreateWithoutJerseysInput = {
    id?: string
    ticketName: string
    category: string
    stock: number
    price: Decimal | DecimalJsLike | number | string
    ticketImage?: string | null
    medalImage?: string | null
    eventDate?: Date | string | null
    followGlobalTimer?: boolean
    isClosed?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    participants?: ParticipantUncheckedCreateNestedManyWithoutEventInput
    benefits?: EventBenefitUncheckedCreateNestedManyWithoutEventInput
    bibConfig?: BibConfigurationUncheckedCreateNestedOneWithoutEventInput
  }

  export type EventCreateOrConnectWithoutJerseysInput = {
    where: EventWhereUniqueInput
    create: XOR<EventCreateWithoutJerseysInput, EventUncheckedCreateWithoutJerseysInput>
  }

  export type ParticipantCreateWithoutJerseyInput = {
    id?: string
    fullNameKtp: string
    bibName: string
    phoneNumber?: string | null
    nik: string
    gender: $Enums.Gender
    birthPlace: string
    birthDate: Date | string
    fullAddress: string
    country?: string
    bloodType: $Enums.BloodType
    medicalHistory?: string | null
    emergencyContactName: string
    emergencyContactPhone: string
    selectedSize?: string | null
    communityName?: string | null
    bibNumber?: string | null
    createdAt?: Date | string
    order: OrderCreateNestedOneWithoutParticipantsInput
    event: EventCreateNestedOneWithoutParticipantsInput
    qrToken?: QrTokenCreateNestedOneWithoutParticipantInput
  }

  export type ParticipantUncheckedCreateWithoutJerseyInput = {
    id?: string
    orderId: string
    eventId: string
    fullNameKtp: string
    bibName: string
    phoneNumber?: string | null
    nik: string
    gender: $Enums.Gender
    birthPlace: string
    birthDate: Date | string
    fullAddress: string
    country?: string
    bloodType: $Enums.BloodType
    medicalHistory?: string | null
    emergencyContactName: string
    emergencyContactPhone: string
    selectedSize?: string | null
    communityName?: string | null
    bibNumber?: string | null
    createdAt?: Date | string
    qrToken?: QrTokenUncheckedCreateNestedOneWithoutParticipantInput
  }

  export type ParticipantCreateOrConnectWithoutJerseyInput = {
    where: ParticipantWhereUniqueInput
    create: XOR<ParticipantCreateWithoutJerseyInput, ParticipantUncheckedCreateWithoutJerseyInput>
  }

  export type ParticipantCreateManyJerseyInputEnvelope = {
    data: ParticipantCreateManyJerseyInput | ParticipantCreateManyJerseyInput[]
    skipDuplicates?: boolean
  }

  export type EventUpsertWithoutJerseysInput = {
    update: XOR<EventUpdateWithoutJerseysInput, EventUncheckedUpdateWithoutJerseysInput>
    create: XOR<EventCreateWithoutJerseysInput, EventUncheckedCreateWithoutJerseysInput>
    where?: EventWhereInput
  }

  export type EventUpdateToOneWithWhereWithoutJerseysInput = {
    where?: EventWhereInput
    data: XOR<EventUpdateWithoutJerseysInput, EventUncheckedUpdateWithoutJerseysInput>
  }

  export type EventUpdateWithoutJerseysInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticketName?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    stock?: IntFieldUpdateOperationsInput | number
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    ticketImage?: NullableStringFieldUpdateOperationsInput | string | null
    medalImage?: NullableStringFieldUpdateOperationsInput | string | null
    eventDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    followGlobalTimer?: BoolFieldUpdateOperationsInput | boolean
    isClosed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: ParticipantUpdateManyWithoutEventNestedInput
    benefits?: EventBenefitUpdateManyWithoutEventNestedInput
    bibConfig?: BibConfigurationUpdateOneWithoutEventNestedInput
  }

  export type EventUncheckedUpdateWithoutJerseysInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticketName?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    stock?: IntFieldUpdateOperationsInput | number
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    ticketImage?: NullableStringFieldUpdateOperationsInput | string | null
    medalImage?: NullableStringFieldUpdateOperationsInput | string | null
    eventDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    followGlobalTimer?: BoolFieldUpdateOperationsInput | boolean
    isClosed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: ParticipantUncheckedUpdateManyWithoutEventNestedInput
    benefits?: EventBenefitUncheckedUpdateManyWithoutEventNestedInput
    bibConfig?: BibConfigurationUncheckedUpdateOneWithoutEventNestedInput
  }

  export type ParticipantUpsertWithWhereUniqueWithoutJerseyInput = {
    where: ParticipantWhereUniqueInput
    update: XOR<ParticipantUpdateWithoutJerseyInput, ParticipantUncheckedUpdateWithoutJerseyInput>
    create: XOR<ParticipantCreateWithoutJerseyInput, ParticipantUncheckedCreateWithoutJerseyInput>
  }

  export type ParticipantUpdateWithWhereUniqueWithoutJerseyInput = {
    where: ParticipantWhereUniqueInput
    data: XOR<ParticipantUpdateWithoutJerseyInput, ParticipantUncheckedUpdateWithoutJerseyInput>
  }

  export type ParticipantUpdateManyWithWhereWithoutJerseyInput = {
    where: ParticipantScalarWhereInput
    data: XOR<ParticipantUpdateManyMutationInput, ParticipantUncheckedUpdateManyWithoutJerseyInput>
  }

  export type UserCreateWithoutOrdersInput = {
    id?: string
    fullName: string
    email: string
    phoneNumber: string
    createdAt?: Date | string
    logs?: LogCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutOrdersInput = {
    id?: string
    fullName: string
    email: string
    phoneNumber: string
    createdAt?: Date | string
    logs?: LogUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutOrdersInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutOrdersInput, UserUncheckedCreateWithoutOrdersInput>
  }

  export type ParticipantCreateWithoutOrderInput = {
    id?: string
    fullNameKtp: string
    bibName: string
    phoneNumber?: string | null
    nik: string
    gender: $Enums.Gender
    birthPlace: string
    birthDate: Date | string
    fullAddress: string
    country?: string
    bloodType: $Enums.BloodType
    medicalHistory?: string | null
    emergencyContactName: string
    emergencyContactPhone: string
    selectedSize?: string | null
    communityName?: string | null
    bibNumber?: string | null
    createdAt?: Date | string
    event: EventCreateNestedOneWithoutParticipantsInput
    jersey?: JerseyCreateNestedOneWithoutParticipantsInput
    qrToken?: QrTokenCreateNestedOneWithoutParticipantInput
  }

  export type ParticipantUncheckedCreateWithoutOrderInput = {
    id?: string
    eventId: string
    fullNameKtp: string
    bibName: string
    phoneNumber?: string | null
    nik: string
    gender: $Enums.Gender
    birthPlace: string
    birthDate: Date | string
    fullAddress: string
    country?: string
    bloodType: $Enums.BloodType
    medicalHistory?: string | null
    emergencyContactName: string
    emergencyContactPhone: string
    jerseyId?: string | null
    selectedSize?: string | null
    communityName?: string | null
    bibNumber?: string | null
    createdAt?: Date | string
    qrToken?: QrTokenUncheckedCreateNestedOneWithoutParticipantInput
  }

  export type ParticipantCreateOrConnectWithoutOrderInput = {
    where: ParticipantWhereUniqueInput
    create: XOR<ParticipantCreateWithoutOrderInput, ParticipantUncheckedCreateWithoutOrderInput>
  }

  export type ParticipantCreateManyOrderInputEnvelope = {
    data: ParticipantCreateManyOrderInput | ParticipantCreateManyOrderInput[]
    skipDuplicates?: boolean
  }

  export type QrTokenCreateWithoutOrderInput = {
    token: string
    createdAt?: Date | string
    participant?: ParticipantCreateNestedOneWithoutQrTokenInput
  }

  export type QrTokenUncheckedCreateWithoutOrderInput = {
    token: string
    participantId?: string | null
    createdAt?: Date | string
  }

  export type QrTokenCreateOrConnectWithoutOrderInput = {
    where: QrTokenWhereUniqueInput
    create: XOR<QrTokenCreateWithoutOrderInput, QrTokenUncheckedCreateWithoutOrderInput>
  }

  export type UserUpsertWithoutOrdersInput = {
    update: XOR<UserUpdateWithoutOrdersInput, UserUncheckedUpdateWithoutOrdersInput>
    create: XOR<UserCreateWithoutOrdersInput, UserUncheckedCreateWithoutOrdersInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutOrdersInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutOrdersInput, UserUncheckedUpdateWithoutOrdersInput>
  }

  export type UserUpdateWithoutOrdersInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    logs?: LogUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutOrdersInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    logs?: LogUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ParticipantUpsertWithWhereUniqueWithoutOrderInput = {
    where: ParticipantWhereUniqueInput
    update: XOR<ParticipantUpdateWithoutOrderInput, ParticipantUncheckedUpdateWithoutOrderInput>
    create: XOR<ParticipantCreateWithoutOrderInput, ParticipantUncheckedCreateWithoutOrderInput>
  }

  export type ParticipantUpdateWithWhereUniqueWithoutOrderInput = {
    where: ParticipantWhereUniqueInput
    data: XOR<ParticipantUpdateWithoutOrderInput, ParticipantUncheckedUpdateWithoutOrderInput>
  }

  export type ParticipantUpdateManyWithWhereWithoutOrderInput = {
    where: ParticipantScalarWhereInput
    data: XOR<ParticipantUpdateManyMutationInput, ParticipantUncheckedUpdateManyWithoutOrderInput>
  }

  export type QrTokenUpsertWithoutOrderInput = {
    update: XOR<QrTokenUpdateWithoutOrderInput, QrTokenUncheckedUpdateWithoutOrderInput>
    create: XOR<QrTokenCreateWithoutOrderInput, QrTokenUncheckedCreateWithoutOrderInput>
    where?: QrTokenWhereInput
  }

  export type QrTokenUpdateToOneWithWhereWithoutOrderInput = {
    where?: QrTokenWhereInput
    data: XOR<QrTokenUpdateWithoutOrderInput, QrTokenUncheckedUpdateWithoutOrderInput>
  }

  export type QrTokenUpdateWithoutOrderInput = {
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participant?: ParticipantUpdateOneWithoutQrTokenNestedInput
  }

  export type QrTokenUncheckedUpdateWithoutOrderInput = {
    token?: StringFieldUpdateOperationsInput | string
    participantId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderCreateWithoutParticipantsInput = {
    id?: string
    totalAmount: Decimal | DecimalJsLike | number | string
    status?: $Enums.OrderStatus
    midtransOrderId?: string | null
    snapToken?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutOrdersInput
    masterQrToken?: QrTokenCreateNestedOneWithoutOrderInput
  }

  export type OrderUncheckedCreateWithoutParticipantsInput = {
    id?: string
    userId: string
    totalAmount: Decimal | DecimalJsLike | number | string
    status?: $Enums.OrderStatus
    midtransOrderId?: string | null
    snapToken?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    masterQrToken?: QrTokenUncheckedCreateNestedOneWithoutOrderInput
  }

  export type OrderCreateOrConnectWithoutParticipantsInput = {
    where: OrderWhereUniqueInput
    create: XOR<OrderCreateWithoutParticipantsInput, OrderUncheckedCreateWithoutParticipantsInput>
  }

  export type EventCreateWithoutParticipantsInput = {
    id?: string
    ticketName: string
    category: string
    stock: number
    price: Decimal | DecimalJsLike | number | string
    ticketImage?: string | null
    medalImage?: string | null
    eventDate?: Date | string | null
    followGlobalTimer?: boolean
    isClosed?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    benefits?: EventBenefitCreateNestedManyWithoutEventInput
    jerseys?: JerseyCreateNestedManyWithoutEventInput
    bibConfig?: BibConfigurationCreateNestedOneWithoutEventInput
  }

  export type EventUncheckedCreateWithoutParticipantsInput = {
    id?: string
    ticketName: string
    category: string
    stock: number
    price: Decimal | DecimalJsLike | number | string
    ticketImage?: string | null
    medalImage?: string | null
    eventDate?: Date | string | null
    followGlobalTimer?: boolean
    isClosed?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    benefits?: EventBenefitUncheckedCreateNestedManyWithoutEventInput
    jerseys?: JerseyUncheckedCreateNestedManyWithoutEventInput
    bibConfig?: BibConfigurationUncheckedCreateNestedOneWithoutEventInput
  }

  export type EventCreateOrConnectWithoutParticipantsInput = {
    where: EventWhereUniqueInput
    create: XOR<EventCreateWithoutParticipantsInput, EventUncheckedCreateWithoutParticipantsInput>
  }

  export type JerseyCreateWithoutParticipantsInput = {
    id?: string
    name: string
    type: string
    sizes: JsonNullValueInput | InputJsonValue
    image?: string | null
    bannerImages?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    event: EventCreateNestedOneWithoutJerseysInput
  }

  export type JerseyUncheckedCreateWithoutParticipantsInput = {
    id?: string
    eventId: string
    name: string
    type: string
    sizes: JsonNullValueInput | InputJsonValue
    image?: string | null
    bannerImages?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type JerseyCreateOrConnectWithoutParticipantsInput = {
    where: JerseyWhereUniqueInput
    create: XOR<JerseyCreateWithoutParticipantsInput, JerseyUncheckedCreateWithoutParticipantsInput>
  }

  export type QrTokenCreateWithoutParticipantInput = {
    token: string
    createdAt?: Date | string
    order?: OrderCreateNestedOneWithoutMasterQrTokenInput
  }

  export type QrTokenUncheckedCreateWithoutParticipantInput = {
    token: string
    orderId?: string | null
    createdAt?: Date | string
  }

  export type QrTokenCreateOrConnectWithoutParticipantInput = {
    where: QrTokenWhereUniqueInput
    create: XOR<QrTokenCreateWithoutParticipantInput, QrTokenUncheckedCreateWithoutParticipantInput>
  }

  export type OrderUpsertWithoutParticipantsInput = {
    update: XOR<OrderUpdateWithoutParticipantsInput, OrderUncheckedUpdateWithoutParticipantsInput>
    create: XOR<OrderCreateWithoutParticipantsInput, OrderUncheckedCreateWithoutParticipantsInput>
    where?: OrderWhereInput
  }

  export type OrderUpdateToOneWithWhereWithoutParticipantsInput = {
    where?: OrderWhereInput
    data: XOR<OrderUpdateWithoutParticipantsInput, OrderUncheckedUpdateWithoutParticipantsInput>
  }

  export type OrderUpdateWithoutParticipantsInput = {
    id?: StringFieldUpdateOperationsInput | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    midtransOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    snapToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutOrdersNestedInput
    masterQrToken?: QrTokenUpdateOneWithoutOrderNestedInput
  }

  export type OrderUncheckedUpdateWithoutParticipantsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    midtransOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    snapToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    masterQrToken?: QrTokenUncheckedUpdateOneWithoutOrderNestedInput
  }

  export type EventUpsertWithoutParticipantsInput = {
    update: XOR<EventUpdateWithoutParticipantsInput, EventUncheckedUpdateWithoutParticipantsInput>
    create: XOR<EventCreateWithoutParticipantsInput, EventUncheckedCreateWithoutParticipantsInput>
    where?: EventWhereInput
  }

  export type EventUpdateToOneWithWhereWithoutParticipantsInput = {
    where?: EventWhereInput
    data: XOR<EventUpdateWithoutParticipantsInput, EventUncheckedUpdateWithoutParticipantsInput>
  }

  export type EventUpdateWithoutParticipantsInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticketName?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    stock?: IntFieldUpdateOperationsInput | number
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    ticketImage?: NullableStringFieldUpdateOperationsInput | string | null
    medalImage?: NullableStringFieldUpdateOperationsInput | string | null
    eventDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    followGlobalTimer?: BoolFieldUpdateOperationsInput | boolean
    isClosed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    benefits?: EventBenefitUpdateManyWithoutEventNestedInput
    jerseys?: JerseyUpdateManyWithoutEventNestedInput
    bibConfig?: BibConfigurationUpdateOneWithoutEventNestedInput
  }

  export type EventUncheckedUpdateWithoutParticipantsInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticketName?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    stock?: IntFieldUpdateOperationsInput | number
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    ticketImage?: NullableStringFieldUpdateOperationsInput | string | null
    medalImage?: NullableStringFieldUpdateOperationsInput | string | null
    eventDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    followGlobalTimer?: BoolFieldUpdateOperationsInput | boolean
    isClosed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    benefits?: EventBenefitUncheckedUpdateManyWithoutEventNestedInput
    jerseys?: JerseyUncheckedUpdateManyWithoutEventNestedInput
    bibConfig?: BibConfigurationUncheckedUpdateOneWithoutEventNestedInput
  }

  export type JerseyUpsertWithoutParticipantsInput = {
    update: XOR<JerseyUpdateWithoutParticipantsInput, JerseyUncheckedUpdateWithoutParticipantsInput>
    create: XOR<JerseyCreateWithoutParticipantsInput, JerseyUncheckedCreateWithoutParticipantsInput>
    where?: JerseyWhereInput
  }

  export type JerseyUpdateToOneWithWhereWithoutParticipantsInput = {
    where?: JerseyWhereInput
    data: XOR<JerseyUpdateWithoutParticipantsInput, JerseyUncheckedUpdateWithoutParticipantsInput>
  }

  export type JerseyUpdateWithoutParticipantsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    sizes?: JsonNullValueInput | InputJsonValue
    image?: NullableStringFieldUpdateOperationsInput | string | null
    bannerImages?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    event?: EventUpdateOneRequiredWithoutJerseysNestedInput
  }

  export type JerseyUncheckedUpdateWithoutParticipantsInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    sizes?: JsonNullValueInput | InputJsonValue
    image?: NullableStringFieldUpdateOperationsInput | string | null
    bannerImages?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QrTokenUpsertWithoutParticipantInput = {
    update: XOR<QrTokenUpdateWithoutParticipantInput, QrTokenUncheckedUpdateWithoutParticipantInput>
    create: XOR<QrTokenCreateWithoutParticipantInput, QrTokenUncheckedCreateWithoutParticipantInput>
    where?: QrTokenWhereInput
  }

  export type QrTokenUpdateToOneWithWhereWithoutParticipantInput = {
    where?: QrTokenWhereInput
    data: XOR<QrTokenUpdateWithoutParticipantInput, QrTokenUncheckedUpdateWithoutParticipantInput>
  }

  export type QrTokenUpdateWithoutParticipantInput = {
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    order?: OrderUpdateOneWithoutMasterQrTokenNestedInput
  }

  export type QrTokenUncheckedUpdateWithoutParticipantInput = {
    token?: StringFieldUpdateOperationsInput | string
    orderId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ParticipantCreateWithoutQrTokenInput = {
    id?: string
    fullNameKtp: string
    bibName: string
    phoneNumber?: string | null
    nik: string
    gender: $Enums.Gender
    birthPlace: string
    birthDate: Date | string
    fullAddress: string
    country?: string
    bloodType: $Enums.BloodType
    medicalHistory?: string | null
    emergencyContactName: string
    emergencyContactPhone: string
    selectedSize?: string | null
    communityName?: string | null
    bibNumber?: string | null
    createdAt?: Date | string
    order: OrderCreateNestedOneWithoutParticipantsInput
    event: EventCreateNestedOneWithoutParticipantsInput
    jersey?: JerseyCreateNestedOneWithoutParticipantsInput
  }

  export type ParticipantUncheckedCreateWithoutQrTokenInput = {
    id?: string
    orderId: string
    eventId: string
    fullNameKtp: string
    bibName: string
    phoneNumber?: string | null
    nik: string
    gender: $Enums.Gender
    birthPlace: string
    birthDate: Date | string
    fullAddress: string
    country?: string
    bloodType: $Enums.BloodType
    medicalHistory?: string | null
    emergencyContactName: string
    emergencyContactPhone: string
    jerseyId?: string | null
    selectedSize?: string | null
    communityName?: string | null
    bibNumber?: string | null
    createdAt?: Date | string
  }

  export type ParticipantCreateOrConnectWithoutQrTokenInput = {
    where: ParticipantWhereUniqueInput
    create: XOR<ParticipantCreateWithoutQrTokenInput, ParticipantUncheckedCreateWithoutQrTokenInput>
  }

  export type OrderCreateWithoutMasterQrTokenInput = {
    id?: string
    totalAmount: Decimal | DecimalJsLike | number | string
    status?: $Enums.OrderStatus
    midtransOrderId?: string | null
    snapToken?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutOrdersInput
    participants?: ParticipantCreateNestedManyWithoutOrderInput
  }

  export type OrderUncheckedCreateWithoutMasterQrTokenInput = {
    id?: string
    userId: string
    totalAmount: Decimal | DecimalJsLike | number | string
    status?: $Enums.OrderStatus
    midtransOrderId?: string | null
    snapToken?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    participants?: ParticipantUncheckedCreateNestedManyWithoutOrderInput
  }

  export type OrderCreateOrConnectWithoutMasterQrTokenInput = {
    where: OrderWhereUniqueInput
    create: XOR<OrderCreateWithoutMasterQrTokenInput, OrderUncheckedCreateWithoutMasterQrTokenInput>
  }

  export type ParticipantUpsertWithoutQrTokenInput = {
    update: XOR<ParticipantUpdateWithoutQrTokenInput, ParticipantUncheckedUpdateWithoutQrTokenInput>
    create: XOR<ParticipantCreateWithoutQrTokenInput, ParticipantUncheckedCreateWithoutQrTokenInput>
    where?: ParticipantWhereInput
  }

  export type ParticipantUpdateToOneWithWhereWithoutQrTokenInput = {
    where?: ParticipantWhereInput
    data: XOR<ParticipantUpdateWithoutQrTokenInput, ParticipantUncheckedUpdateWithoutQrTokenInput>
  }

  export type ParticipantUpdateWithoutQrTokenInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullNameKtp?: StringFieldUpdateOperationsInput | string
    bibName?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    nik?: StringFieldUpdateOperationsInput | string
    gender?: EnumGenderFieldUpdateOperationsInput | $Enums.Gender
    birthPlace?: StringFieldUpdateOperationsInput | string
    birthDate?: DateTimeFieldUpdateOperationsInput | Date | string
    fullAddress?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    bloodType?: EnumBloodTypeFieldUpdateOperationsInput | $Enums.BloodType
    medicalHistory?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContactName?: StringFieldUpdateOperationsInput | string
    emergencyContactPhone?: StringFieldUpdateOperationsInput | string
    selectedSize?: NullableStringFieldUpdateOperationsInput | string | null
    communityName?: NullableStringFieldUpdateOperationsInput | string | null
    bibNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    order?: OrderUpdateOneRequiredWithoutParticipantsNestedInput
    event?: EventUpdateOneRequiredWithoutParticipantsNestedInput
    jersey?: JerseyUpdateOneWithoutParticipantsNestedInput
  }

  export type ParticipantUncheckedUpdateWithoutQrTokenInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    fullNameKtp?: StringFieldUpdateOperationsInput | string
    bibName?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    nik?: StringFieldUpdateOperationsInput | string
    gender?: EnumGenderFieldUpdateOperationsInput | $Enums.Gender
    birthPlace?: StringFieldUpdateOperationsInput | string
    birthDate?: DateTimeFieldUpdateOperationsInput | Date | string
    fullAddress?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    bloodType?: EnumBloodTypeFieldUpdateOperationsInput | $Enums.BloodType
    medicalHistory?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContactName?: StringFieldUpdateOperationsInput | string
    emergencyContactPhone?: StringFieldUpdateOperationsInput | string
    jerseyId?: NullableStringFieldUpdateOperationsInput | string | null
    selectedSize?: NullableStringFieldUpdateOperationsInput | string | null
    communityName?: NullableStringFieldUpdateOperationsInput | string | null
    bibNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderUpsertWithoutMasterQrTokenInput = {
    update: XOR<OrderUpdateWithoutMasterQrTokenInput, OrderUncheckedUpdateWithoutMasterQrTokenInput>
    create: XOR<OrderCreateWithoutMasterQrTokenInput, OrderUncheckedCreateWithoutMasterQrTokenInput>
    where?: OrderWhereInput
  }

  export type OrderUpdateToOneWithWhereWithoutMasterQrTokenInput = {
    where?: OrderWhereInput
    data: XOR<OrderUpdateWithoutMasterQrTokenInput, OrderUncheckedUpdateWithoutMasterQrTokenInput>
  }

  export type OrderUpdateWithoutMasterQrTokenInput = {
    id?: StringFieldUpdateOperationsInput | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    midtransOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    snapToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutOrdersNestedInput
    participants?: ParticipantUpdateManyWithoutOrderNestedInput
  }

  export type OrderUncheckedUpdateWithoutMasterQrTokenInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    midtransOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    snapToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: ParticipantUncheckedUpdateManyWithoutOrderNestedInput
  }

  export type UserCreateWithoutLogsInput = {
    id?: string
    fullName: string
    email: string
    phoneNumber: string
    createdAt?: Date | string
    orders?: OrderCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutLogsInput = {
    id?: string
    fullName: string
    email: string
    phoneNumber: string
    createdAt?: Date | string
    orders?: OrderUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutLogsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutLogsInput, UserUncheckedCreateWithoutLogsInput>
  }

  export type AdminCreateWithoutLogsInput = {
    id?: string
    username: string
    email: string
    password: string
    fullName: string
    isActive?: boolean
    tokenVersion?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    role: RoleCreateNestedOneWithoutAdminsInput
  }

  export type AdminUncheckedCreateWithoutLogsInput = {
    id?: string
    username: string
    email: string
    password: string
    fullName: string
    roleId: string
    isActive?: boolean
    tokenVersion?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AdminCreateOrConnectWithoutLogsInput = {
    where: AdminWhereUniqueInput
    create: XOR<AdminCreateWithoutLogsInput, AdminUncheckedCreateWithoutLogsInput>
  }

  export type UserUpsertWithoutLogsInput = {
    update: XOR<UserUpdateWithoutLogsInput, UserUncheckedUpdateWithoutLogsInput>
    create: XOR<UserCreateWithoutLogsInput, UserUncheckedCreateWithoutLogsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutLogsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutLogsInput, UserUncheckedUpdateWithoutLogsInput>
  }

  export type UserUpdateWithoutLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orders?: OrderUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orders?: OrderUncheckedUpdateManyWithoutUserNestedInput
  }

  export type AdminUpsertWithoutLogsInput = {
    update: XOR<AdminUpdateWithoutLogsInput, AdminUncheckedUpdateWithoutLogsInput>
    create: XOR<AdminCreateWithoutLogsInput, AdminUncheckedCreateWithoutLogsInput>
    where?: AdminWhereInput
  }

  export type AdminUpdateToOneWithWhereWithoutLogsInput = {
    where?: AdminWhereInput
    data: XOR<AdminUpdateWithoutLogsInput, AdminUncheckedUpdateWithoutLogsInput>
  }

  export type AdminUpdateWithoutLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    tokenVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    role?: RoleUpdateOneRequiredWithoutAdminsNestedInput
  }

  export type AdminUncheckedUpdateWithoutLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    roleId?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    tokenVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventCreateWithoutBibConfigInput = {
    id?: string
    ticketName: string
    category: string
    stock: number
    price: Decimal | DecimalJsLike | number | string
    ticketImage?: string | null
    medalImage?: string | null
    eventDate?: Date | string | null
    followGlobalTimer?: boolean
    isClosed?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    participants?: ParticipantCreateNestedManyWithoutEventInput
    benefits?: EventBenefitCreateNestedManyWithoutEventInput
    jerseys?: JerseyCreateNestedManyWithoutEventInput
  }

  export type EventUncheckedCreateWithoutBibConfigInput = {
    id?: string
    ticketName: string
    category: string
    stock: number
    price: Decimal | DecimalJsLike | number | string
    ticketImage?: string | null
    medalImage?: string | null
    eventDate?: Date | string | null
    followGlobalTimer?: boolean
    isClosed?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    participants?: ParticipantUncheckedCreateNestedManyWithoutEventInput
    benefits?: EventBenefitUncheckedCreateNestedManyWithoutEventInput
    jerseys?: JerseyUncheckedCreateNestedManyWithoutEventInput
  }

  export type EventCreateOrConnectWithoutBibConfigInput = {
    where: EventWhereUniqueInput
    create: XOR<EventCreateWithoutBibConfigInput, EventUncheckedCreateWithoutBibConfigInput>
  }

  export type EventUpsertWithoutBibConfigInput = {
    update: XOR<EventUpdateWithoutBibConfigInput, EventUncheckedUpdateWithoutBibConfigInput>
    create: XOR<EventCreateWithoutBibConfigInput, EventUncheckedCreateWithoutBibConfigInput>
    where?: EventWhereInput
  }

  export type EventUpdateToOneWithWhereWithoutBibConfigInput = {
    where?: EventWhereInput
    data: XOR<EventUpdateWithoutBibConfigInput, EventUncheckedUpdateWithoutBibConfigInput>
  }

  export type EventUpdateWithoutBibConfigInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticketName?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    stock?: IntFieldUpdateOperationsInput | number
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    ticketImage?: NullableStringFieldUpdateOperationsInput | string | null
    medalImage?: NullableStringFieldUpdateOperationsInput | string | null
    eventDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    followGlobalTimer?: BoolFieldUpdateOperationsInput | boolean
    isClosed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: ParticipantUpdateManyWithoutEventNestedInput
    benefits?: EventBenefitUpdateManyWithoutEventNestedInput
    jerseys?: JerseyUpdateManyWithoutEventNestedInput
  }

  export type EventUncheckedUpdateWithoutBibConfigInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticketName?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    stock?: IntFieldUpdateOperationsInput | number
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    ticketImage?: NullableStringFieldUpdateOperationsInput | string | null
    medalImage?: NullableStringFieldUpdateOperationsInput | string | null
    eventDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    followGlobalTimer?: BoolFieldUpdateOperationsInput | boolean
    isClosed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: ParticipantUncheckedUpdateManyWithoutEventNestedInput
    benefits?: EventBenefitUncheckedUpdateManyWithoutEventNestedInput
    jerseys?: JerseyUncheckedUpdateManyWithoutEventNestedInput
  }

  export type AdminCreateWithoutRoleInput = {
    id?: string
    username: string
    email: string
    password: string
    fullName: string
    isActive?: boolean
    tokenVersion?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    logs?: LogCreateNestedManyWithoutAdminInput
  }

  export type AdminUncheckedCreateWithoutRoleInput = {
    id?: string
    username: string
    email: string
    password: string
    fullName: string
    isActive?: boolean
    tokenVersion?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    logs?: LogUncheckedCreateNestedManyWithoutAdminInput
  }

  export type AdminCreateOrConnectWithoutRoleInput = {
    where: AdminWhereUniqueInput
    create: XOR<AdminCreateWithoutRoleInput, AdminUncheckedCreateWithoutRoleInput>
  }

  export type AdminCreateManyRoleInputEnvelope = {
    data: AdminCreateManyRoleInput | AdminCreateManyRoleInput[]
    skipDuplicates?: boolean
  }

  export type AdminUpsertWithWhereUniqueWithoutRoleInput = {
    where: AdminWhereUniqueInput
    update: XOR<AdminUpdateWithoutRoleInput, AdminUncheckedUpdateWithoutRoleInput>
    create: XOR<AdminCreateWithoutRoleInput, AdminUncheckedCreateWithoutRoleInput>
  }

  export type AdminUpdateWithWhereUniqueWithoutRoleInput = {
    where: AdminWhereUniqueInput
    data: XOR<AdminUpdateWithoutRoleInput, AdminUncheckedUpdateWithoutRoleInput>
  }

  export type AdminUpdateManyWithWhereWithoutRoleInput = {
    where: AdminScalarWhereInput
    data: XOR<AdminUpdateManyMutationInput, AdminUncheckedUpdateManyWithoutRoleInput>
  }

  export type AdminScalarWhereInput = {
    AND?: AdminScalarWhereInput | AdminScalarWhereInput[]
    OR?: AdminScalarWhereInput[]
    NOT?: AdminScalarWhereInput | AdminScalarWhereInput[]
    id?: StringFilter<"Admin"> | string
    username?: StringFilter<"Admin"> | string
    email?: StringFilter<"Admin"> | string
    password?: StringFilter<"Admin"> | string
    fullName?: StringFilter<"Admin"> | string
    roleId?: StringFilter<"Admin"> | string
    isActive?: BoolFilter<"Admin"> | boolean
    tokenVersion?: IntFilter<"Admin"> | number
    createdAt?: DateTimeFilter<"Admin"> | Date | string
    updatedAt?: DateTimeFilter<"Admin"> | Date | string
  }

  export type RoleCreateWithoutAdminsInput = {
    id?: string
    name: string
    description?: string | null
    permissions: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RoleUncheckedCreateWithoutAdminsInput = {
    id?: string
    name: string
    description?: string | null
    permissions: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RoleCreateOrConnectWithoutAdminsInput = {
    where: RoleWhereUniqueInput
    create: XOR<RoleCreateWithoutAdminsInput, RoleUncheckedCreateWithoutAdminsInput>
  }

  export type LogCreateWithoutAdminInput = {
    id?: string
    action: string
    description: string
    entityType?: string | null
    entityId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    user?: UserCreateNestedOneWithoutLogsInput
  }

  export type LogUncheckedCreateWithoutAdminInput = {
    id?: string
    action: string
    description: string
    userId?: string | null
    entityType?: string | null
    entityId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type LogCreateOrConnectWithoutAdminInput = {
    where: LogWhereUniqueInput
    create: XOR<LogCreateWithoutAdminInput, LogUncheckedCreateWithoutAdminInput>
  }

  export type LogCreateManyAdminInputEnvelope = {
    data: LogCreateManyAdminInput | LogCreateManyAdminInput[]
    skipDuplicates?: boolean
  }

  export type RoleUpsertWithoutAdminsInput = {
    update: XOR<RoleUpdateWithoutAdminsInput, RoleUncheckedUpdateWithoutAdminsInput>
    create: XOR<RoleCreateWithoutAdminsInput, RoleUncheckedCreateWithoutAdminsInput>
    where?: RoleWhereInput
  }

  export type RoleUpdateToOneWithWhereWithoutAdminsInput = {
    where?: RoleWhereInput
    data: XOR<RoleUpdateWithoutAdminsInput, RoleUncheckedUpdateWithoutAdminsInput>
  }

  export type RoleUpdateWithoutAdminsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    permissions?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoleUncheckedUpdateWithoutAdminsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    permissions?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LogUpsertWithWhereUniqueWithoutAdminInput = {
    where: LogWhereUniqueInput
    update: XOR<LogUpdateWithoutAdminInput, LogUncheckedUpdateWithoutAdminInput>
    create: XOR<LogCreateWithoutAdminInput, LogUncheckedCreateWithoutAdminInput>
  }

  export type LogUpdateWithWhereUniqueWithoutAdminInput = {
    where: LogWhereUniqueInput
    data: XOR<LogUpdateWithoutAdminInput, LogUncheckedUpdateWithoutAdminInput>
  }

  export type LogUpdateManyWithWhereWithoutAdminInput = {
    where: LogScalarWhereInput
    data: XOR<LogUpdateManyMutationInput, LogUncheckedUpdateManyWithoutAdminInput>
  }

  export type OrderCreateManyUserInput = {
    id?: string
    totalAmount: Decimal | DecimalJsLike | number | string
    status?: $Enums.OrderStatus
    midtransOrderId?: string | null
    snapToken?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LogCreateManyUserInput = {
    id?: string
    action: string
    description: string
    adminId?: string | null
    entityType?: string | null
    entityId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type OrderUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    midtransOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    snapToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: ParticipantUpdateManyWithoutOrderNestedInput
    masterQrToken?: QrTokenUpdateOneWithoutOrderNestedInput
  }

  export type OrderUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    midtransOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    snapToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: ParticipantUncheckedUpdateManyWithoutOrderNestedInput
    masterQrToken?: QrTokenUncheckedUpdateOneWithoutOrderNestedInput
  }

  export type OrderUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    midtransOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    snapToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LogUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    entityType?: NullableStringFieldUpdateOperationsInput | string | null
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    admin?: AdminUpdateOneWithoutLogsNestedInput
  }

  export type LogUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    adminId?: NullableStringFieldUpdateOperationsInput | string | null
    entityType?: NullableStringFieldUpdateOperationsInput | string | null
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LogUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    adminId?: NullableStringFieldUpdateOperationsInput | string | null
    entityType?: NullableStringFieldUpdateOperationsInput | string | null
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ParticipantCreateManyEventInput = {
    id?: string
    orderId: string
    fullNameKtp: string
    bibName: string
    phoneNumber?: string | null
    nik: string
    gender: $Enums.Gender
    birthPlace: string
    birthDate: Date | string
    fullAddress: string
    country?: string
    bloodType: $Enums.BloodType
    medicalHistory?: string | null
    emergencyContactName: string
    emergencyContactPhone: string
    jerseyId?: string | null
    selectedSize?: string | null
    communityName?: string | null
    bibNumber?: string | null
    createdAt?: Date | string
  }

  export type EventBenefitCreateManyEventInput = {
    id?: string
    name: string
    description: string
    image?: string | null
  }

  export type JerseyCreateManyEventInput = {
    id?: string
    name: string
    type: string
    sizes: JsonNullValueInput | InputJsonValue
    image?: string | null
    bannerImages?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ParticipantUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullNameKtp?: StringFieldUpdateOperationsInput | string
    bibName?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    nik?: StringFieldUpdateOperationsInput | string
    gender?: EnumGenderFieldUpdateOperationsInput | $Enums.Gender
    birthPlace?: StringFieldUpdateOperationsInput | string
    birthDate?: DateTimeFieldUpdateOperationsInput | Date | string
    fullAddress?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    bloodType?: EnumBloodTypeFieldUpdateOperationsInput | $Enums.BloodType
    medicalHistory?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContactName?: StringFieldUpdateOperationsInput | string
    emergencyContactPhone?: StringFieldUpdateOperationsInput | string
    selectedSize?: NullableStringFieldUpdateOperationsInput | string | null
    communityName?: NullableStringFieldUpdateOperationsInput | string | null
    bibNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    order?: OrderUpdateOneRequiredWithoutParticipantsNestedInput
    jersey?: JerseyUpdateOneWithoutParticipantsNestedInput
    qrToken?: QrTokenUpdateOneWithoutParticipantNestedInput
  }

  export type ParticipantUncheckedUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    fullNameKtp?: StringFieldUpdateOperationsInput | string
    bibName?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    nik?: StringFieldUpdateOperationsInput | string
    gender?: EnumGenderFieldUpdateOperationsInput | $Enums.Gender
    birthPlace?: StringFieldUpdateOperationsInput | string
    birthDate?: DateTimeFieldUpdateOperationsInput | Date | string
    fullAddress?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    bloodType?: EnumBloodTypeFieldUpdateOperationsInput | $Enums.BloodType
    medicalHistory?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContactName?: StringFieldUpdateOperationsInput | string
    emergencyContactPhone?: StringFieldUpdateOperationsInput | string
    jerseyId?: NullableStringFieldUpdateOperationsInput | string | null
    selectedSize?: NullableStringFieldUpdateOperationsInput | string | null
    communityName?: NullableStringFieldUpdateOperationsInput | string | null
    bibNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    qrToken?: QrTokenUncheckedUpdateOneWithoutParticipantNestedInput
  }

  export type ParticipantUncheckedUpdateManyWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    fullNameKtp?: StringFieldUpdateOperationsInput | string
    bibName?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    nik?: StringFieldUpdateOperationsInput | string
    gender?: EnumGenderFieldUpdateOperationsInput | $Enums.Gender
    birthPlace?: StringFieldUpdateOperationsInput | string
    birthDate?: DateTimeFieldUpdateOperationsInput | Date | string
    fullAddress?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    bloodType?: EnumBloodTypeFieldUpdateOperationsInput | $Enums.BloodType
    medicalHistory?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContactName?: StringFieldUpdateOperationsInput | string
    emergencyContactPhone?: StringFieldUpdateOperationsInput | string
    jerseyId?: NullableStringFieldUpdateOperationsInput | string | null
    selectedSize?: NullableStringFieldUpdateOperationsInput | string | null
    communityName?: NullableStringFieldUpdateOperationsInput | string | null
    bibNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventBenefitUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type EventBenefitUncheckedUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type EventBenefitUncheckedUpdateManyWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type JerseyUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    sizes?: JsonNullValueInput | InputJsonValue
    image?: NullableStringFieldUpdateOperationsInput | string | null
    bannerImages?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: ParticipantUpdateManyWithoutJerseyNestedInput
  }

  export type JerseyUncheckedUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    sizes?: JsonNullValueInput | InputJsonValue
    image?: NullableStringFieldUpdateOperationsInput | string | null
    bannerImages?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: ParticipantUncheckedUpdateManyWithoutJerseyNestedInput
  }

  export type JerseyUncheckedUpdateManyWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    sizes?: JsonNullValueInput | InputJsonValue
    image?: NullableStringFieldUpdateOperationsInput | string | null
    bannerImages?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ParticipantCreateManyJerseyInput = {
    id?: string
    orderId: string
    eventId: string
    fullNameKtp: string
    bibName: string
    phoneNumber?: string | null
    nik: string
    gender: $Enums.Gender
    birthPlace: string
    birthDate: Date | string
    fullAddress: string
    country?: string
    bloodType: $Enums.BloodType
    medicalHistory?: string | null
    emergencyContactName: string
    emergencyContactPhone: string
    selectedSize?: string | null
    communityName?: string | null
    bibNumber?: string | null
    createdAt?: Date | string
  }

  export type ParticipantUpdateWithoutJerseyInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullNameKtp?: StringFieldUpdateOperationsInput | string
    bibName?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    nik?: StringFieldUpdateOperationsInput | string
    gender?: EnumGenderFieldUpdateOperationsInput | $Enums.Gender
    birthPlace?: StringFieldUpdateOperationsInput | string
    birthDate?: DateTimeFieldUpdateOperationsInput | Date | string
    fullAddress?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    bloodType?: EnumBloodTypeFieldUpdateOperationsInput | $Enums.BloodType
    medicalHistory?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContactName?: StringFieldUpdateOperationsInput | string
    emergencyContactPhone?: StringFieldUpdateOperationsInput | string
    selectedSize?: NullableStringFieldUpdateOperationsInput | string | null
    communityName?: NullableStringFieldUpdateOperationsInput | string | null
    bibNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    order?: OrderUpdateOneRequiredWithoutParticipantsNestedInput
    event?: EventUpdateOneRequiredWithoutParticipantsNestedInput
    qrToken?: QrTokenUpdateOneWithoutParticipantNestedInput
  }

  export type ParticipantUncheckedUpdateWithoutJerseyInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    fullNameKtp?: StringFieldUpdateOperationsInput | string
    bibName?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    nik?: StringFieldUpdateOperationsInput | string
    gender?: EnumGenderFieldUpdateOperationsInput | $Enums.Gender
    birthPlace?: StringFieldUpdateOperationsInput | string
    birthDate?: DateTimeFieldUpdateOperationsInput | Date | string
    fullAddress?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    bloodType?: EnumBloodTypeFieldUpdateOperationsInput | $Enums.BloodType
    medicalHistory?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContactName?: StringFieldUpdateOperationsInput | string
    emergencyContactPhone?: StringFieldUpdateOperationsInput | string
    selectedSize?: NullableStringFieldUpdateOperationsInput | string | null
    communityName?: NullableStringFieldUpdateOperationsInput | string | null
    bibNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    qrToken?: QrTokenUncheckedUpdateOneWithoutParticipantNestedInput
  }

  export type ParticipantUncheckedUpdateManyWithoutJerseyInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    fullNameKtp?: StringFieldUpdateOperationsInput | string
    bibName?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    nik?: StringFieldUpdateOperationsInput | string
    gender?: EnumGenderFieldUpdateOperationsInput | $Enums.Gender
    birthPlace?: StringFieldUpdateOperationsInput | string
    birthDate?: DateTimeFieldUpdateOperationsInput | Date | string
    fullAddress?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    bloodType?: EnumBloodTypeFieldUpdateOperationsInput | $Enums.BloodType
    medicalHistory?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContactName?: StringFieldUpdateOperationsInput | string
    emergencyContactPhone?: StringFieldUpdateOperationsInput | string
    selectedSize?: NullableStringFieldUpdateOperationsInput | string | null
    communityName?: NullableStringFieldUpdateOperationsInput | string | null
    bibNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ParticipantCreateManyOrderInput = {
    id?: string
    eventId: string
    fullNameKtp: string
    bibName: string
    phoneNumber?: string | null
    nik: string
    gender: $Enums.Gender
    birthPlace: string
    birthDate: Date | string
    fullAddress: string
    country?: string
    bloodType: $Enums.BloodType
    medicalHistory?: string | null
    emergencyContactName: string
    emergencyContactPhone: string
    jerseyId?: string | null
    selectedSize?: string | null
    communityName?: string | null
    bibNumber?: string | null
    createdAt?: Date | string
  }

  export type ParticipantUpdateWithoutOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullNameKtp?: StringFieldUpdateOperationsInput | string
    bibName?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    nik?: StringFieldUpdateOperationsInput | string
    gender?: EnumGenderFieldUpdateOperationsInput | $Enums.Gender
    birthPlace?: StringFieldUpdateOperationsInput | string
    birthDate?: DateTimeFieldUpdateOperationsInput | Date | string
    fullAddress?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    bloodType?: EnumBloodTypeFieldUpdateOperationsInput | $Enums.BloodType
    medicalHistory?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContactName?: StringFieldUpdateOperationsInput | string
    emergencyContactPhone?: StringFieldUpdateOperationsInput | string
    selectedSize?: NullableStringFieldUpdateOperationsInput | string | null
    communityName?: NullableStringFieldUpdateOperationsInput | string | null
    bibNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    event?: EventUpdateOneRequiredWithoutParticipantsNestedInput
    jersey?: JerseyUpdateOneWithoutParticipantsNestedInput
    qrToken?: QrTokenUpdateOneWithoutParticipantNestedInput
  }

  export type ParticipantUncheckedUpdateWithoutOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    fullNameKtp?: StringFieldUpdateOperationsInput | string
    bibName?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    nik?: StringFieldUpdateOperationsInput | string
    gender?: EnumGenderFieldUpdateOperationsInput | $Enums.Gender
    birthPlace?: StringFieldUpdateOperationsInput | string
    birthDate?: DateTimeFieldUpdateOperationsInput | Date | string
    fullAddress?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    bloodType?: EnumBloodTypeFieldUpdateOperationsInput | $Enums.BloodType
    medicalHistory?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContactName?: StringFieldUpdateOperationsInput | string
    emergencyContactPhone?: StringFieldUpdateOperationsInput | string
    jerseyId?: NullableStringFieldUpdateOperationsInput | string | null
    selectedSize?: NullableStringFieldUpdateOperationsInput | string | null
    communityName?: NullableStringFieldUpdateOperationsInput | string | null
    bibNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    qrToken?: QrTokenUncheckedUpdateOneWithoutParticipantNestedInput
  }

  export type ParticipantUncheckedUpdateManyWithoutOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    fullNameKtp?: StringFieldUpdateOperationsInput | string
    bibName?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    nik?: StringFieldUpdateOperationsInput | string
    gender?: EnumGenderFieldUpdateOperationsInput | $Enums.Gender
    birthPlace?: StringFieldUpdateOperationsInput | string
    birthDate?: DateTimeFieldUpdateOperationsInput | Date | string
    fullAddress?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    bloodType?: EnumBloodTypeFieldUpdateOperationsInput | $Enums.BloodType
    medicalHistory?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContactName?: StringFieldUpdateOperationsInput | string
    emergencyContactPhone?: StringFieldUpdateOperationsInput | string
    jerseyId?: NullableStringFieldUpdateOperationsInput | string | null
    selectedSize?: NullableStringFieldUpdateOperationsInput | string | null
    communityName?: NullableStringFieldUpdateOperationsInput | string | null
    bibNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminCreateManyRoleInput = {
    id?: string
    username: string
    email: string
    password: string
    fullName: string
    isActive?: boolean
    tokenVersion?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AdminUpdateWithoutRoleInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    tokenVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    logs?: LogUpdateManyWithoutAdminNestedInput
  }

  export type AdminUncheckedUpdateWithoutRoleInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    tokenVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    logs?: LogUncheckedUpdateManyWithoutAdminNestedInput
  }

  export type AdminUncheckedUpdateManyWithoutRoleInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    tokenVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LogCreateManyAdminInput = {
    id?: string
    action: string
    description: string
    userId?: string | null
    entityType?: string | null
    entityId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type LogUpdateWithoutAdminInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    entityType?: NullableStringFieldUpdateOperationsInput | string | null
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutLogsNestedInput
  }

  export type LogUncheckedUpdateWithoutAdminInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    entityType?: NullableStringFieldUpdateOperationsInput | string | null
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LogUncheckedUpdateManyWithoutAdminInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    entityType?: NullableStringFieldUpdateOperationsInput | string | null
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use UserCountOutputTypeDefaultArgs instead
     */
    export type UserCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use EventCountOutputTypeDefaultArgs instead
     */
    export type EventCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = EventCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use JerseyCountOutputTypeDefaultArgs instead
     */
    export type JerseyCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = JerseyCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use OrderCountOutputTypeDefaultArgs instead
     */
    export type OrderCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = OrderCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use RoleCountOutputTypeDefaultArgs instead
     */
    export type RoleCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = RoleCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AdminCountOutputTypeDefaultArgs instead
     */
    export type AdminCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AdminCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use EventDefaultArgs instead
     */
    export type EventArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = EventDefaultArgs<ExtArgs>
    /**
     * @deprecated Use EventBenefitDefaultArgs instead
     */
    export type EventBenefitArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = EventBenefitDefaultArgs<ExtArgs>
    /**
     * @deprecated Use JerseyDefaultArgs instead
     */
    export type JerseyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = JerseyDefaultArgs<ExtArgs>
    /**
     * @deprecated Use OrderDefaultArgs instead
     */
    export type OrderArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = OrderDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ParticipantDefaultArgs instead
     */
    export type ParticipantArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ParticipantDefaultArgs<ExtArgs>
    /**
     * @deprecated Use QrTokenDefaultArgs instead
     */
    export type QrTokenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = QrTokenDefaultArgs<ExtArgs>
    /**
     * @deprecated Use LogDefaultArgs instead
     */
    export type LogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = LogDefaultArgs<ExtArgs>
    /**
     * @deprecated Use BibConfigurationDefaultArgs instead
     */
    export type BibConfigurationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = BibConfigurationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use RoleDefaultArgs instead
     */
    export type RoleArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = RoleDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AdminDefaultArgs instead
     */
    export type AdminArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AdminDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AppSettingDefaultArgs instead
     */
    export type AppSettingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AppSettingDefaultArgs<ExtArgs>
    /**
     * @deprecated Use RoutePointDefaultArgs instead
     */
    export type RoutePointArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = RoutePointDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}