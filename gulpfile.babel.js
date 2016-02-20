import fs from 'fs';
import gulp from 'gulp';
import rename from 'gulp-rename';
import rimraf from 'rimraf';
import markdown from 'gulp-markdown';
import template from 'gulp-template';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import fileinclude from 'gulp-file-include';

const supportLanguages = ['en', 'zh-TW'];
const vendor = `./public/vendor`;

function merge(lang, file, tmpDocFiles) {
  const str = file.replace('.html', '');
  const title = str.replace(/-/g, ' ').toUpperCase();
  const content = fs.readFileSync(`${tmpDocFiles}${file}`, 'utf8');

  return gulp
    .src('./docs/template.html')
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@root'
    }))
    .pipe(template({
      content,
      title
    }))
    .pipe(rename(file))
    .pipe(gulp.dest(`./docs/${lang}/`))
}

gulp.task('uglify-js', () => {
  return gulp
    .src([
      `${vendor}/jquery/dist/jquery.js`,
      `${vendor}/bootstrap/dist/js/bootstrap.js`,
      `${vendor}/js-emoji/emoji.js`,
      `${vendor}/js-emoji/jquery.emoji.js`,
      `./public/js/download-detect.js`
    ])
    .pipe(uglify())
    .pipe(concat('all.min.js'))
    .pipe(gulp.dest('./public/shared/js/'));
});

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

gulp.task('build', ['mergeEn', 'mergeTW'], (cb) => {
  rimraf('./docs/tmp', cb);
});

gulp.task('default', ['uglify-js', 'build']);
