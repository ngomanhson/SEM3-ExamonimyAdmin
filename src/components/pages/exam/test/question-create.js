import { useState, useRef } from "react";
function Question_Create({ onQuestionAdded, onQuestionRemoved }) {
    const [questions, setQuestions] = useState([]);
    const [isQuestionAdded, setIsQuestionAdded] = useState(false);
    const [isEmpty, setIsEmpty] = useState(true);
    const questionModalRef = useRef(null);
    const questionTitleRef = useRef(null);
    const [questionCount, setQuestionCount] = useState(0);
    const [easyCount, setEasyCount] = useState(0);
    const [mediumCount, setMediumCount] = useState(0);
    const [difficultCount, setDifficultCount] = useState(0);
    const levelRef = useRef(null);
    const answerARef = useRef(null);
    const answerBRef = useRef(null);
    const answerCRef = useRef(null);
    const answerDRef = useRef(null);
    const correctAnswerRef = useRef(null);
    const [questionErrors, setQuestionErrors] = useState({});
    const validateQuestion = () => {
        //validate cho các câu hỏi
        let valid = true;
        const newQuestionErrors = {};
        if (!questionTitleRef.current.value) {
            newQuestionErrors.title = "Please enter question title";
            valid = false;
        } else if (questionTitleRef.current.value < 3) {
            newQuestionErrors.title = "Enter at least 3 characters";
            valid = false;
        } else if (questionTitleRef.current.value > 255) {
            newQuestionErrors.title = "Enter up to 255 characters";
            valid = false;
        }
        if (!answerARef.current.value) {
            newQuestionErrors.answerA = "Please enter choice A";
            valid = false;
        }
        if (!answerBRef.current.value) {
            newQuestionErrors.answerB = "Please enter choice B";
            valid = false;
        }
        if (!answerCRef.current.value) {
            newQuestionErrors.answerC = "Please enter choice C";
            valid = false;
        }
        if (!answerDRef.current.value) {
            newQuestionErrors.answerD = "Please enter choice D";
            valid = false;
        }
        if (!correctAnswerRef.current.value) {
            newQuestionErrors.correctAnswer = "Please select correct answer";
            valid = false;
        }
        if (!levelRef.current.value) {
            newQuestionErrors.level = "Please select level of question";
            valid = false;
        }
        setQuestionErrors(newQuestionErrors);
        return valid;
    };
    useState(() => {
        //xử lý lưu tạm thời câu hỏi vào localStorage
        const storedQuestions = localStorage.getItem("questions");
        if (storedQuestions) {
            setQuestions(JSON.parse(storedQuestions));
        }
    }, [questions]);
    const addQuestion = (question, callback) => {
        const updatedQuestions = [...questions, question];
        setQuestions(updatedQuestions);
        setIsEmpty(false);
        localStorage.setItem("questions", JSON.stringify(updatedQuestions));
        if (typeof callback === "function") {
            callback(updatedQuestions);
        }
    };
    const handleAddQuestion = () => {
        const isValid = validateQuestion();
        if (isValid) {
            const questionTitle = questionTitleRef.current.value;
            const level = levelRef.current.value;
            const answerA = answerARef.current.value;
            const answerB = answerBRef.current.value;
            const answerC = answerCRef.current.value;
            const answerD = answerDRef.current.value;
            const correctAnswer = correctAnswerRef.current.value;
            let score = 0; //TÍNH TOÁN ĐIỂM CÂU HỎI THEO ĐỘ KHÓ
            if (level === "1" && easyCount < 6) {
                setEasyCount(easyCount + 1);
                score = 3.85;
            } else if (level === "2" && mediumCount < 5) {
                setMediumCount(mediumCount + 1);
                score = 6.41;
            } else if (level === "3" && difficultCount < 5) {
                setDifficultCount(difficultCount + 1);
                score = 8.97;
            }
            const question = {
                title: questionTitle,
                level,
                score,
                answers: [
                    //kiểm tra đáp án đúng
                    { content: answerA, status: correctAnswer === "A" ? 1 : 0 },
                    { content: answerB, status: correctAnswer === "B" ? 1 : 0 },
                    { content: answerC, status: correctAnswer === "C" ? 1 : 0 },
                    { content: answerD, status: correctAnswer === "D" ? 1 : 0 },
                ],
            };
            addQuestion(question, onQuestionAdded);
            setIsQuestionAdded(true); //đóng modal khi thêm câu hỏi thành công
            if (questionModalRef.current) {
                questionModalRef.current.click();
            }
            questionTitleRef.current.value = ""; //XOÁ THÔNG TIN CŨ ĐÃ ĐIỀN Ở CÁC TRƯỜNG INPUT
            levelRef.current.value = "";
            answerARef.current.value = "";
            answerBRef.current.value = "";
            answerCRef.current.value = "";
            answerDRef.current.value = "";
            correctAnswerRef.current.value = "";

            if (questionCount < 16) {
                setQuestionCount(questionCount + 1);
            }

            // an nut them cau hoi khi du 16 cau
            if (questionCount === 15) {
                const addQuestionButton = document.querySelector(
                    ".btn.btn-primary.float-sm-end.m-l-10"
                );
                if (addQuestionButton) {
                    addQuestionButton.style.display = "none";
                }
            }
        }
    };
    const removeQuestion = (index) => {
        // Xoá câu hỏi
        const updatedQuestions = [...questions];
        const removedQuestion = updatedQuestions[index];
        updatedQuestions.splice(index, 1);
        setQuestions(updatedQuestions);
        localStorage.setItem("questions", JSON.stringify(updatedQuestions));
        setQuestionCount(questionCount - 1);
        const level = removedQuestion.level;
        if (level === "1") {
            setEasyCount(easyCount - 1);
        } else if (level === "2") {
            setMediumCount(mediumCount - 1);
        } else if (level === "3") {
            setDifficultCount(difficultCount - 1);
        }
        if (questionCount < 17) {
            const addQuestionButton = document.querySelector(
                ".btn.btn-primary.float-sm-end.m-l-10"
            );
            if (addQuestionButton) {
                addQuestionButton.style.display = "block";
            }
        }
        if (updatedQuestions.length === 0) {
            setIsEmpty(true);
        }
        if (typeof onQuestionRemoved === "function") {
            onQuestionRemoved(updatedQuestions);
        }
    };

    return (
        <>
            <div className="col-xl-6">
                <div className="card bg-white">
                    <div class="card-header">
                        <h5 class="card-title">
                            Test Question
                            <button
                                type="button"
                                className="btn btn-primary float-sm-end m-l-10"
                                data-bs-toggle="modal"
                                data-bs-target="#scrollable-modal"
                            >
                                Add New Question
                            </button>
                        </h5>
                        <div
                            className="modal fade"
                            id="scrollable-modal"
                            tabindex="-1"
                            role="dialog"
                            aria-labelledby="scrollableModalTitle"
                            aria-hidden="true"
                            ref={questionModalRef}
                        >
                            <div
                                className="modal-dialog modal-dialog-scrollable"
                                role="document"
                            >
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5
                                            className="modal-title"
                                            id="scrollableModalTitle"
                                        >
                                            Create a new question
                                        </h5>
                                        <button
                                            type="button"
                                            className="btn-close"
                                            data-bs-dismiss="modal"
                                            aria-label="Close"
                                        ></button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="form-group">
                                            <label>Question Name</label>
                                            <input
                                                type="text"
                                                ref={questionTitleRef}
                                                className="form-control"
                                            />
                                            {questionErrors.title && (
                                                <div className="text-danger">
                                                    {questionErrors.title}
                                                </div>
                                            )}
                                        </div>
                                        <div className="form-group">
                                            <b>Input word for choice's</b>
                                        </div>
                                        <div className="form-group">
                                            <label>Choice A</label>
                                            <input
                                                type="text"
                                                ref={answerARef}
                                                className="form-control"
                                            />
                                            {questionErrors.answerA && (
                                                <div className="text-danger">
                                                    {questionErrors.answerA}
                                                </div>
                                            )}
                                        </div>
                                        <div className="form-group">
                                            <label>Choice B</label>
                                            <input
                                                type="text"
                                                ref={answerBRef}
                                                className="form-control"
                                            />
                                            {questionErrors.answerB && (
                                                <div className="text-danger">
                                                    {questionErrors.answerB}
                                                </div>
                                            )}
                                        </div>
                                        <div className="form-group">
                                            <label>Choice C</label>
                                            <input
                                                type="text"
                                                ref={answerCRef}
                                                className="form-control"
                                            />
                                            {questionErrors.answerC && (
                                                <div className="text-danger">
                                                    {questionErrors.answerC}
                                                </div>
                                            )}
                                        </div>
                                        <div className="form-group">
                                            <label>Choice D</label>
                                            <input
                                                type="text"
                                                ref={answerDRef}
                                                className="form-control"
                                            />
                                            {questionErrors.answerD && (
                                                <div className="text-danger">
                                                    {questionErrors.answerD}
                                                </div>
                                            )}
                                        </div>
                                        <div className="form-group">
                                            <label>Correct Answer</label>
                                            <select
                                                className="form-control"
                                                ref={correctAnswerRef}
                                            >
                                                <option value="">
                                                    Select correct answer...
                                                </option>
                                                <option>A</option>
                                                <option>B</option>
                                                <option>C</option>
                                                <option>D</option>
                                            </select>
                                            {questionErrors.correctAnswer && (
                                                <div className="text-danger">
                                                    {
                                                        questionErrors.correctAnswer
                                                    }
                                                </div>
                                            )}
                                        </div>
                                        <div className="form-group">
                                            <label>Level of difficult</label>
                                            <select
                                                className="form-control"
                                                ref={levelRef}
                                            >
                                                <option value="">
                                                    Select level question...
                                                </option>
                                                {easyCount < 6 && (
                                                    <option value="1">
                                                        Easy
                                                    </option>
                                                )}
                                                {mediumCount < 5 && (
                                                    <option value="2">
                                                        Medium
                                                    </option>
                                                )}
                                                {difficultCount < 5 && (
                                                    <option value="3">
                                                        Difficult
                                                    </option>
                                                )}
                                            </select>
                                            {questionErrors.level && (
                                                <div className="text-danger">
                                                    {questionErrors.level}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            data-bs-dismiss="modal"
                                        >
                                            Close
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={handleAddQuestion}
                                            data-bs-dismiss={
                                                isQuestionAdded ? "modal" : ""
                                            }
                                        >
                                            Add Question
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div class="row">
                            <div class="col-md-10">
                                <h5>
                                    {questionCount}/16 Question{" "}
                                    <span
                                        style={{
                                            fontSize: "13px",
                                            color: "#8F9BBA",
                                        }}
                                    >
                                        ({easyCount}/6 easy, {mediumCount}/5
                                        medium, {difficultCount}/5 difficult)
                                    </span>
                                </h5>
                            </div>
                            <div class="col-md-2">
                                <h5>Action</h5>
                            </div>
                        </div>
                        <div class="col-md-12">
                            <div class="vertical-scroll scroll-demo">
                                {isEmpty ? (
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            height: "100%",
                                        }}
                                    >
                                        <p
                                            style={{
                                                fontSize: "20px",
                                                color: "#8F9BBA",
                                            }}
                                        >
                                            Questions you add will appear here!
                                        </p>
                                    </div>
                                ) : (
                                    questions.map((question, index) => {
                                        return (
                                            <div key={index} className="row">
                                                <div className="col-md-10">
                                                    <div className="invoice-terms">
                                                        <h6>
                                                            {index + 1}.
                                                            <span>
                                                                {question.title}
                                                            </span>{" "}
                                                            <span
                                                                style={{
                                                                    fontSize:
                                                                        "15px",
                                                                    color: "#8F9BBA",
                                                                }}
                                                            >
                                                                (
                                                                {question.level ===
                                                                "1"
                                                                    ? "Easy"
                                                                    : question.level ===
                                                                      "2"
                                                                    ? "Medium"
                                                                    : "Difficult"}
                                                                ,{" "}
                                                                {question.score}{" "}
                                                                point)
                                                            </span>
                                                        </h6>
                                                        {question.answers.map(
                                                            (answer, i) => (
                                                                <p
                                                                    key={i}
                                                                    className={`mb-1 ${
                                                                        answer.status ===
                                                                        1
                                                                            ? "text-primary"
                                                                            : ""
                                                                    }`}
                                                                >
                                                                    {String.fromCharCode(
                                                                        65 + i
                                                                    )}
                                                                    -
                                                                    <span>
                                                                        {
                                                                            answer.content
                                                                        }
                                                                    </span>
                                                                    {answer.status ===
                                                                        1 && (
                                                                        <i className="fa fa-check"></i>
                                                                    )}
                                                                </p>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="col-md-2">
                                                    <button
                                                        type="button"
                                                        class="btn btn-info btn-sm"
                                                    >
                                                        Update
                                                    </button>
                                                    <button
                                                        type="button"
                                                        class="btn btn-danger btn-sm"
                                                        onClick={() =>
                                                            removeQuestion(
                                                                index
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Question_Create;
