create type "auth"."code_challenge_method" as enum ('s256', 'plain');

create table "auth"."flow_state" (
    "id" uuid not null,
    "user_id" uuid,
    "auth_code" text not null,
    "code_challenge_method" auth.code_challenge_method not null,
    "code_challenge" text not null,
    "provider_type" text not null,
    "provider_access_token" text,
    "provider_refresh_token" text,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone
);


CREATE UNIQUE INDEX flow_state_pkey ON auth.flow_state USING btree (id);

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);

alter table "auth"."flow_state" add constraint "flow_state_pkey" PRIMARY KEY using index "flow_state_pkey";


alter table "public"."messages" drop constraint "messages_user_id_fkey";

alter table "public"."messages" drop constraint "messages_pkey";

alter table "public"."users" drop constraint "users_pkey";

drop index if exists "public"."messages_pkey";

drop index if exists "public"."users_pkey";

drop table "public"."messages";

drop table "public"."users";


