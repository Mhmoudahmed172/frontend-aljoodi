const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const ts = require('typescript');
const source = fs.readFileSync('src/lib/preview/catalog.ts', 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const sandbox = { exports: {}, process: { env: { NEXT_PUBLIC_LOCAL_PREVIEW_FIXTURES: 'true' } } };
vm.runInNewContext(compiled, sandbox);
const { previewTeachers, previewSubjects, previewCourses, previewUnitsBySubject, getPreviewFixture } = sandbox.exports;
assert.equal(previewTeachers.length, 2);
assert.equal(previewCourses.length, 4);
for (const t of previewTeachers) {
 assert(t.photo_url.startsWith('/images/demo/'), 'Fictional identities must only use illustrative portraits');
 assert(fs.existsSync('public' + t.photo_url));
 assert.equal(t.stats.ratings_count, 0);
 assert.equal(t.stats.students_count, 0);
 const derived = t.subjects.reduce((n, s) => n + previewUnitsBySubject[s.slug].reduce((m, u) => m + u.lessons.length, 0), 0);
 assert.equal(t.stats.lessons_count, derived, 'Counts must describe the actual demo catalog');
 for (const subject of t.subjects) assert(previewSubjects.find(s => s.uuid === subject.uuid));
}
for (const s of previewSubjects) {
 const course = s.courses[0];
 assert(previewTeachers.some(t => t.uuid === course.teachers[0].uuid));
 assert(Number(course.prices.both) > 0);
 assert(getPreviewFixture(`/api/v1/subjects/${s.slug}/units`, { course: course.slug }).items.length > 0);
 assert.equal(getPreviewFixture(`/api/v1/subjects/${s.slug}/units`, { course: 'unknown-course' }).items.length, 0);
 const teachers = getPreviewFixture('/api/v1/teachers', { subject: s.uuid }).items;
 assert.equal(teachers.length, 1);
 assert.equal(teachers[0].uuid, course.teachers[0].uuid);
 for (const unit of previewUnitsBySubject[s.slug]) for (const lesson of unit.lessons) assert.equal(lesson.has_video, false, 'Never invent playable backend videos');
}
for (const path of ['/user/v1/profile', '/user/v1/subscriptions', '/api/v1/auth/login', '/api/v1/lessons/real-id/video']) assert.equal(getPreviewFixture(path), undefined);
assert.equal(getPreviewFixture('/api/v1/teachers', { q: 'سامر' }).items.length, 1);
assert.equal(getPreviewFixture('/api/v1/courses', { q: 'الكيمياء' }).items.length, 1);
console.log('Demo catalog passed: identity separation, asset paths, relational data, derived counts, filters and endpoint boundaries.');
