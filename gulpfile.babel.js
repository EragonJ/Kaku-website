import fs from 'fs';
import gulp from 'gulp';
import rename from 'gulp-rename';
import clean from 'gulp-clean';
import markdown from 'gulp-markdown';
import template from 'gulp-template';

const supportLanguages = ['en', 'zh-TW'];

function merge(lang, file, tmpDocFiles) {
  const str = file.replace('.html', '');
  const title = str.replace(/-/g, ' ').toUpperCase();
  const content = fs.readFileSync(`${tmpDocFiles}${file}`, 'utf8');

  return gulp
    .src('./docs/template.html')
    .pipe(template({
      content,
      title
    }))
    .pipe(rename(file))
    .pipe(gulp.dest(`./docs/${lang}/`))
}

gulp.task('en', (cb) => {
  const docsFiles = `./docs/src/en/`;
  const files = fs.readdirSync(docsFiles);

  return gulp
    .src('./docs/src/en/*.md')
    .pipe(markdown())
    .pipe(gulp.dest(`./docs/tmp/en`));
    cb();
});

gulp.task('mergeEn', ['en'], () => {
  const tmpDocFiles = `./docs/tmp/en/`;
  const mergeDocs = fs.readdirSync(tmpDocFiles);

  mergeDocs.map((file) => {
    merge(supportLanguages[0], file, tmpDocFiles);
  });
});

gulp.task('zhTW', (cb) => {
  const docsFiles = `./docs/src/zh-TW/`;
  const files = fs.readdirSync(docsFiles);

  return gulp
    .src('./docs/src/zh-TW/*.md')
    .pipe(markdown())
    .pipe(gulp.dest(`./docs/tmp/zh-TW`));
    cb();
});

gulp.task('mergeTW', ['zhTW'], () => {
  const tmpDocFiles = `./docs/tmp/zh-TW/`;
  const mergeDocs = fs.readdirSync(tmpDocFiles);

  mergeDocs.map((file) => {
    merge(supportLanguages[1], file, tmpDocFiles);
  });
});

gulp.task('build', ['mergeEn', 'mergeTW'], () => {
  return gulp
    .src('./docs/tmp')
    .pipe(clean())
});

gulp.task('default', ['build']);
