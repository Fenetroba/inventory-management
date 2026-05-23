CREATE TABLE "inventory" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"category" varchar(255),
	"price" integer,
	"quantity" integer,
	"image_url" varchar(500),
	"create_At" timestamp DEFAULT now() NOT NULL,
	"updated_At" timestamp DEFAULT now() NOT NULL
);
