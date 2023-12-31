const url = {
    BASE_URL: "https://localhost:7218/api",
    MENU: {
        LIST: "/Menu",
    },
    AUTH: {
        PROFILE: "/Auth/staff/profile",
        LOGIN: "/Auth/staff-login",
        UPDATE_PROFILE: "/Auth/staff/update-profile",
        CHANGE_PASSWORD: "/Auth/staff/change-password",
        FORGOT_PASSWORD: "/Auth/staff/forgot-password",
        RESET_PASSWORD: "/Auth/Staff/reset-password",
    },
    CLASS: {
        LIST: "/classes",
        CLASSOFTEACHER: "/classes/get-by-teacher",
        CREATE: "/classes",
        EDIT: "/classes",
        DELETE: "/classes",
        DETAIL: "/classes/get-by-slug",
    },
    STUDENT: {
        LIST: "/student",
        CREATE: "/student",
        CREATE_EXCEL: "/student/by-excel",
        EDIT: "/student",
        DELETE: "/student",
        DELETE_FOREVER: "/student/permanently-delete",
        DETAIL: "/student/get-by-codeStudent",
        CLASS_ID: "/student/get-by-classId",
        CLASS_ID_TEACHER: "/student/get-by-classId-teacher",
        TEST_SLUG: "/student/student-test/{}",
    },
    COURSE: {
        LIST: "/course",
        CREATE: "/course",
        DETAIL: "/product/get-by-codeCourse",
    },
    QUESTION: {
        LIST: "/question",
        DELETE: "/question",
        CREATE_MULTIPLE_QUESTION: "/question/multiple-choice",
        CREATE_ESSAY_QUESTION: "/question/essay",
        EDIT_MULTIPLE_QUESTION: "/question/multiple-choice",
    },
    ClassCourse: {
        LIST: "/ClassCourse",
        CREATE: "/ClassCourse",
    },
    STAFF: {
        LIST: "/staff",
        CREATE: "/staff",
        DELETE: "/staff",
        LISTROLE: "/staff/get-by-role?role=Teacher",
    },
    EXAM: {
        LIST: "/exam",
        CREATE: "/exam",
        EDIT: "/exam",
        DELETE: "/exam",
        DETAIL: "/exam/get-by-slug",
    },
    TEST: {
        LIST: "/test",
        ALL: "/test/test-list",
        TESTOFTEACHER: "/test/get-by-teacher",
        DETAIL_TEST_OF_SLUG_TEACHER: "/test/get-by-slug-teacher",
        CREATE_MULTIPLE: "/test/multiple-choice-by-hand",
        CREATE_MULTIPLE_RETAKE: "/test/multiple-choice-by-hand/retake",
        CREATE_MULTIPLE_EXCEL: "/test/multiple-choice-by-excel-file",
        CREATE_MULTIPLE_EXCEL_RETAKE: "/test/multiple-choice-by-excel-file/retake",
        CREATE_MULTIPLE_AUTO: "/test/multiple-choice-by-auto",
        CREATE_MULTIPLE_AUTO_RETAKE: "/test/multiple-choice-by-auto/retake",
        CREATE_ESSAY: "/test/essay-by-hand",
        CREATE_ESSAY_RETAKE: "/test/essay-by-hand/retake",
        CREATE_ESSAY_AUTO: "/test/essay-by-auto",
        CREATE_ESSAY_AUTO_RETAKE: "/test/essay-by-auto/retake",
        EDIT: "/test",
        DELETE: "/test",
        DETAIL: "/test/get-by-slug",
        EXAM_ID: "/test/get-by-examId",
    },
    TESTQUESTION: {
        LIST: "/TestQuestion/{}",
        RESULT: "/TestQuestion/result-test/{}/details/{}",
    },
    GRADE: {
        LIST: "/grade",
    },
    ANSWER: {
        QUESTION_ID: "/answer/get-by-questionId",
        ANSWERFORSTUDENT: "/answersForStudent",
        SCORING: "/answersForStudent/scoring-essay",
    },
    RETEST: {
        LIST: "RegisterExam",
        CONFIRM: "RegisterExam/approve-register",
    },
    LOCKTEST: {
        LOCK: "/test/lock-test/{}",
        UNLOCK: "test/unlock-test/{}",
    },
    DASHBOARD: {
        ADMIN: {
            USER_STATS: "/Dashboard/user-stats",
            TEST_STATS: "Dashboard/test-stats",
            REGISTER_EXAM_STATS: "/Dashboard/registerExam-stats",
            AVERAGE: "/Dashboard/average-scores/{}",
            TEST_COURSE: "/Dashboard/test-exam-stats",
            GENDER: "/Dashboard/gender-distribution",
            RECENT_TEST: "/Dashboard/top-10-recent-tests",
            HIGH_AVERAGE: "/Dashboard/top-10-high-average",
        },
        TEACHER: {
            LATEST_CLASSES: "/Dashboard/latest-classes",
            RECENT_TESTS: "/Dashboard/recent-tests-for-teacher",
            NO_SCORE: "/Dashboard/test-type-essay-noscore",
            TOTAL_CLASS: "/Dashboard/total-class",
            STATS_GRADE: "/Dashboard/test-grade-stats",
            TOTAL_TESTS: "/Dashboard/test-stats",
        },
    },
};
export default url;
