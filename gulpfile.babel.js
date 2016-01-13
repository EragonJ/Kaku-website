import fs from 'fs';
import gulp from 'gulp';
import path from 'path';
import rename from 'gulp-rename';
import clean from 'gulp-clean';
import markdown from 'gulp-markdown';
import template from 'gulp-template';

function getFiles(dir) {
  return fs.readdirSync(dir);
}

gulp.task('genDocs', () => {
  const dir = ['en', 'zh-TW'];

  for (let i = 0; i < dir.length; i++) {
    let docsFiles = path.join(`${__dirname}/docs/${dir[i]}/`);
    let mapFiles = getFiles(docsFiles);

    mapFiles.map((file) => {
      return gulp
        .src(`${docsPath}${file}`)
        .pipe(markdown())
        .pipe(gulp.dest(`./docs/tmp/${dir[i]}`));
    });
  }
});

gulp.task('mergeTemplate', ['genDocs'], () => {
  setTimeout(() => {
    const dir = ['en', 'zh-TW'];

    for (let i = 0; i < dir.length; i++) {
      let tmpDocFiles = path.join(`./docs/tmp/${dir[i]}/`);
      let mergeDocs = getFiles(tmpDocFiles);

      mergeDocs.map((file) => {
        let title = file.replace('.html', '');
        let content = fs.readFileSync(`${tmpDocPath}${file}`, 'utf8');

        return gulp
          .src('./docs/template.html')
          .pipe(template({
            content,
            title
          }))
          .pipe(rename(file))
          .pipe(gulp.dest(`./docs/${dir[i]}-page`))
      });
    }
  }, 500);
});

gulp.task('remove', ['genDocs'], () => {
  setTimeout(() => {
    return gulp
      .src('./docs/tmp')
      .pipe(clean())
  }, 600);
});

gulp.task('default', ['remove']);
