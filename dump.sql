CREATE TABLE "products" (
	"id" serial NOT NULL,
	"code" INTEGER NOT NULL UNIQUE,
	"name" TEXT NOT NULL,
	"quantity" integer NOT NULL,
	"description" TEXT NOT NULL,
	"value" numeric NOT NULL,
	"image" TEXT NOT NULL,
	"brand_id" integer NOT NULL,
	"category_id" integer NOT NULL,
	"visits" integer NOT NULL DEFAULT '0',
	CONSTRAINT "products_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "brands" (
	"id" serial NOT NULL,
	"name" TEXT NOT NULL UNIQUE,
	CONSTRAINT "brands_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "categories" (
	"id" serial NOT NULL,
	"name" TEXT NOT NULL UNIQUE,
	CONSTRAINT "categories_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "users" (
	"id" serial,
	"name" varchar(50) NOT NULL,
	"cpf" varchar(11) NOT NULL UNIQUE,
	"password" TEXT NOT NULL,
	"email" varchar(50) NOT NULL UNIQUE,
	CONSTRAINT "users_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "cart" (
	"id" serial NOT NULL,
	"user_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	CONSTRAINT "cart_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "sales" (
	"id" serial NOT NULL,
	"user_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"time" TIMESTAMP NOT NULL,
	"rating" integer ,
	CONSTRAINT "sales_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "sessions" (
	"id" serial NOT NULL,
	"user_id" integer NOT NULL,
	"token" uuid NOT NULL UNIQUE,
	CONSTRAINT "sessions_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



ALTER TABLE "products" ADD CONSTRAINT "products_fk0" FOREIGN KEY ("brand") REFERENCES "brands"("id");
ALTER TABLE "products" ADD CONSTRAINT "products_fk1" FOREIGN KEY ("category") REFERENCES "categories"("id");




ALTER TABLE "cart" ADD CONSTRAINT "cart_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");
ALTER TABLE "cart" ADD CONSTRAINT "cart_fk1" FOREIGN KEY ("product_id") REFERENCES "products"("id");

ALTER TABLE "sales" ADD CONSTRAINT "sales_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");
ALTER TABLE "sales" ADD CONSTRAINT "sales_fk1" FOREIGN KEY ("product_id") REFERENCES "products"("id");

ALTER TABLE "sessions" ADD CONSTRAINT "sessions_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");

    DELETE FROM products;
    DELETE FROM categories;
    DELETE FROM brands;
    DELETE FROM ratings;
    DELETE FROM sales;
    DELETE FROM sessions;
    DELETE FROM users;