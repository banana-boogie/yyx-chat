alter table if exists "public"."messages" add column "openai_response" text;
alter table if exists "public"."messages" drop column "phone_number";
