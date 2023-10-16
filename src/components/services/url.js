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
        CREATE:"/staff",
        DELETE: "/staff",
    },
};
export default url;
