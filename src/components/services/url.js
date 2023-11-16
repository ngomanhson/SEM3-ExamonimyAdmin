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
        CREATE: "/classes",
        EDIT: "/classes",
        DELETE: "/classes",
        DETAIL: "/classes/get-by-slug",
    },
    STUDENT: {
        LIST: "/student",
        CREATE: "/student",
        EDIT: "/student",
        DELETE: "/student",
        DELETE_FOREVER: "/student/permanently-delete",
        DETAIL: "/student/get-by-codeStudent",
        CLASS_ID: "/student/get-by-classId",
        TEST_SLUG: "/student/student-test/{}",
    },
    COURSE: {
        LIST: "/course",
        CREATE: "/course",
        DETAIL: "/product/get-by-codeCourse",
    },
    ClassCourse: {
        LIST: "/ClassCourse",
        CREATE: "/ClassCourse",
    },
    STAFF: {
        LIST: "/staff",
        CREATE: "/staff",
        DELETE: "/staff",
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
        CREATE_MULTIPLE: "/test/multiple-choice-by-hand",
        CREATE_MULTIPLE_EXCEL: "/test/multiple-choice-by-excel-file",
        CREATE_MULTIPLE_AUTO: "/test/multiple-choice-by-auto",
        CREATE_ESSAY: "/test/essay-by-hand",
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
};
export default url;
