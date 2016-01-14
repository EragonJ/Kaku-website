import fs from 'fs';
import gulp from 'gulp';
import path from 'path';
import rename from 'gulp-rename';
import clean from 'gulp-clean';
import markdown from 'gulp-markdown';
import template from 'gulp-template';

const supportedLanguages = ['en', 'zh-TW'];

gulp.task('genDocs', () => {
  for (let i = 0; i < supportedLanguages.length; i++) {
    let docsFiles = path.join(`${__dirname}/docs/src/${supportedLanguages[i]}/`);
    let mapFiles = fs.readdirSync(docsFiles);

    mapFiles.map((file) => {
      gulp
        .src(`${docsFiles}${file}`)
        .pipe(markdown())
        .pipe(gulp.dest(`./docs/tmp/${supportedLanguages[i]}`));
    });
  }
});

gulp.task('mergeTemplate', ['genDocs'], () => {
  setTimeout(() => {
    for (let i = 0; i < supportedLanguages.length; i++) {
      let tmpDocFiles = path.join(`./docs/tmp/${supportedLanguages[i]}/`);
      let mergeDocs = fs.readdirSync(tmpDocFiles);

      mergeDocs.map((file) => {
        let title = file.replace('.html', '');
        let content = fs.readFileSync(`${tmpDocFiles}${file}`, 'utf8');

        return gulp
          .src('./docs/template.html')
          .pipe(template({
            content,
            title
          }))
          .pipe(rename(file))
          .pipe(gulp.dest(`./docs/${supportedLanguages[i]}`))
      });
    }
  }, 500);
});

gulp.task('remove', () => {
  setTimeout(() => {
    return gulp
      .src('./docs/tmp')
      .pipe(clean())
  }, 600);
});

gulp.task('default', ['mergeTemplate']);
