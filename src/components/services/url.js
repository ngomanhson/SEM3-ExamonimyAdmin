const url = {
    BASE_URL: "https://localhost:7218/api",
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
    },
    COURSE: {
        LIST: "/course",
        CREATE: "/course",
        DETAIL: "/product/get-by-codeCourse",
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
        CREATE_MULTIPLE: "/test/multiple-choice",
        EDIT: "/test",
        DELETE: "/test",
        DETAIL: "/test/get-by-slug",
        EXAM_ID: "/test/get-by-examId",
    },
};
export default url;
