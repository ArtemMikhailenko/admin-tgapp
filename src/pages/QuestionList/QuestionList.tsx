// src/pages/QuestionList.tsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './QuestionList.module.css'

interface QuizQuestion {
  _id: string
  question: string
  correctAnswer: string
  wrongAnswers: string[]
}

function QuestionList() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  
  // Пагинация
  const [currentPage, setCurrentPage] = useState(1)
  const questionsPerPage = 10

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/quiz/questions?limit=1000`)
      if (!response.ok) {
        throw new Error('Failed to fetch questions')
      }
      const data = await response.json()
      // Если данные обернуты в объект с полем questions, используем его, иначе данные сами по себе
      const questionsArray = Array.isArray(data)
        ? data
        : data.questions || []
      setQuestions(questionsArray)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className={styles.loader}>Loading...</div>
  if (error) return <div className={styles.error}>Error: {error}</div>

  // Вычисление пагинации
  const totalQuestions = questions.length
  const totalPages = Math.ceil(totalQuestions / questionsPerPage)
  const indexOfLastQuestion = currentPage * questionsPerPage
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage
  const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>All Questions</h1>
      {totalQuestions === 0 ? (
        <p>No questions found.</p>
      ) : (
        <>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Question</th>
                <th>Correct Answer</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentQuestions.map(q => (
                <tr key={q._id}>
                  <td>{q.question}</td>
                  <td>{q.correctAnswer}</td>
                  <td>
                    <Link to={`/edit/${q._id}`} className={styles.editLink}>
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Пагинация */}
          <div className={styles.pagination}>
            <button 
              onClick={() => paginate(currentPage - 1)} 
              disabled={currentPage === 1}
              className={styles.pageButton}
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={`${styles.pageButton} ${currentPage === index + 1 ? styles.activePage : ''}`}
              >
                {index + 1}
              </button>
            ))}
            <button 
              onClick={() => paginate(currentPage + 1)} 
              disabled={currentPage === totalPages}
              className={styles.pageButton}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default QuestionList;
