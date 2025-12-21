import { Migration } from '@mikro-orm/migrations';

export class Migration20251221173216 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table \`base_entity\` (\`id\` integer not null primary key autoincrement, \`created_at\` datetime not null, \`updated_at\` datetime not null);`,
    );

    this.addSql(
      `create table \`tag\` (\`id\` integer not null primary key autoincrement, \`created_at\` datetime not null, \`updated_at\` datetime not null, \`name\` text not null);`,
    );

    this.addSql(
      `create table \`user\` (\`id\` integer not null primary key autoincrement, \`created_at\` datetime not null, \`updated_at\` datetime not null, \`full_name\` text not null, \`email\` text not null, \`password\` text not null, \`bio\` text not null default '', \`social\` json null);`,
    );
    this.addSql(`create unique index \`user_email_unique\` on \`user\` (\`email\`);`);

    this.addSql(
      `create table \`article\` (\`id\` integer not null primary key autoincrement, \`created_at\` datetime not null, \`updated_at\` datetime not null, \`slug\` text not null, \`title\` text not null, \`description\` text not null, \`text\` text not null, \`author_id\` integer not null, constraint \`article_author_id_foreign\` foreign key (\`author_id\`) references \`user\` (\`id\`) on update cascade);`,
    );
    this.addSql(`create unique index \`article_slug_unique\` on \`article\` (\`slug\`);`);
    this.addSql(`create index \`article_title_index\` on \`article\` (\`title\`);`);
    this.addSql(`create index \`article_author_id_index\` on \`article\` (\`author_id\`);`);

    this.addSql(
      `create table \`comment\` (\`id\` integer not null primary key autoincrement, \`created_at\` datetime not null, \`updated_at\` datetime not null, \`text\` text not null, \`article_id\` integer not null, \`author_id\` integer not null, constraint \`comment_article_id_foreign\` foreign key (\`article_id\`) references \`article\` (\`id\`) on update cascade, constraint \`comment_author_id_foreign\` foreign key (\`author_id\`) references \`user\` (\`id\`) on update cascade);`,
    );
    this.addSql(`create index \`comment_article_id_index\` on \`comment\` (\`article_id\`);`);
    this.addSql(`create index \`comment_author_id_index\` on \`comment\` (\`author_id\`);`);

    this.addSql(
      `create table \`article_tags\` (\`article_id\` integer not null, \`tag_id\` integer not null, primary key (\`article_id\`, \`tag_id\`), constraint \`article_tags_article_id_foreign\` foreign key (\`article_id\`) references \`article\` (\`id\`) on update cascade on delete cascade, constraint \`article_tags_tag_id_foreign\` foreign key (\`tag_id\`) references \`tag\` (\`id\`) on update cascade on delete cascade);`,
    );
    this.addSql(`create index \`article_tags_article_id_index\` on \`article_tags\` (\`article_id\`);`);
    this.addSql(`create index \`article_tags_tag_id_index\` on \`article_tags\` (\`tag_id\`);`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists \`base_entity\`;`);
    this.addSql(`drop table if exists \`tag\`;`);
    this.addSql(`drop table if exists \`user\`;`);
    this.addSql(`drop table if exists \`article\`;`);
    this.addSql(`drop table if exists \`comment\`;`);
    this.addSql(`drop table if exists \`article_tags\`;`);
  }
}
