import React, { useState } from 'react';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, AlertCircle, Play, Check, ChevronLeft, BookOpen } from 'lucide-react';
import allQuizzes from './data/index.js';

// =============================================
// HÀM TIỆN ÍCH: TRỘN CÂU HỎI VÀ ĐÁP ÁN
// =============================================
const shuffleQuiz = (quiz) => {
  if (!quiz || !quiz.questions) return quiz;

  // 1. Sao chép danh sách câu hỏi để không làm thay đổi dữ liệu gốc
  let shuffledQuestions = [...quiz.questions];

  // 2. Trộn thứ tự các câu hỏi
  for (let i = shuffledQuestions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledQuestions[i], shuffledQuestions[j]] = [shuffledQuestions[j], shuffledQuestions[i]];
  }

  // 3. Trộn thứ tự các đáp án bên trong mỗi câu hỏi
  shuffledQuestions = shuffledQuestions.map(q => {
    let shuffledOptions = [...q.options];
    for (let i = shuffledOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
    }
    return { ...q, options: shuffledOptions };
  });

  return { ...quiz, questions: shuffledQuestions };
};

// =============================================
// TRANG CHỦ - CHỌN BỘ ĐỀ THI
// =============================================
function HomePage({ onSelectQuiz }) {
  return (
    <div style={styles.page}>
      <div style={styles.homeHeader}>
        <div style={styles.homeHeaderInner}>
          <div style={styles.homeLogoWrap}>
            <BookOpen size={32} color="#fff" />
          </div>
          <h1 style={styles.homeTitle}>Ôn Thi Trắc Nghiệm</h1>
          <p style={styles.homeSubtitle}>Chọn môn học để bắt đầu ôn tập</p>
        </div>
      </div>

      <div style={styles.homeContent}>
        <div style={styles.cardGrid}>
          {allQuizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} onSelect={() => onSelectQuiz(quiz)} />
          ))}
        </div>

        <p style={styles.homeHint}>
          💡 Thêm bộ đề mới: tạo file <code style={styles.code}>.json</code> trong <code style={styles.code}>src/data/</code> rồi import vào <code style={styles.code}>index.js</code>
        </p>
      </div>
    </div>
  );
}

function QuizCard({ quiz, onSelect }) {
  const [hovered, setHovered] = useState(false);
  const count = quiz.questions ? quiz.questions.length : 0;

  return (
    <button
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...styles.card,
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? '0 12px 30px -5px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.07)',
      }}
    >
      <div style={{ ...styles.cardAccent, background: quiz.color }} />
      <div style={styles.cardBody}>
        <div style={{ ...styles.cardIconWrap, background: quiz.color + '20' }}>
          <span style={styles.cardIcon}>{quiz.icon}</span>
        </div>
        <div>
          <h2 style={styles.cardTitle}>{quiz.title}</h2>
          <p style={styles.cardDesc}>{quiz.description}</p>
        </div>
        <div style={styles.cardFooter}>
          <span style={{ ...styles.cardBadge, background: quiz.color + '18', color: quiz.color }}>
            {count} câu hỏi
          </span>
          <div style={{ ...styles.cardBtn, background: quiz.color }}>
            <Play size={13} fill="#fff" color="#fff" />
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#fff' }}>Bắt đầu</span>
          </div>
        </div>
      </div>
    </button>
  );
}

// =============================================
// MÀN HÌNH GIỚI THIỆU BÀI THI
// =============================================
function IntroScreen({ quiz, onStart, onBack }) {
  return (
    <div style={{ ...styles.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={styles.introCard}>
        <div style={{ height: 6, background: quiz.color, borderRadius: '1rem 1rem 0 0' }} />
        <div style={styles.introBody}>
          <button onClick={onBack} style={styles.backBtn}>
            <ChevronLeft size={16} /> Quay lại
          </button>
          <div style={{ ...styles.introIconWrap, background: quiz.color + '1a' }}>
            <span style={styles.introIcon}>{quiz.icon}</span>
          </div>
          <h1 style={styles.introTitle}>{quiz.title}</h1>
          <p style={styles.introDesc}>{quiz.description}</p>
          <ul style={styles.introList}>
            {[
              `${quiz.questions.length} câu hỏi trắc nghiệm`,
              'Biết kết quả đúng/sai ngay sau mỗi câu',
              'Xem lại toàn bộ câu sai cuối bài',
              'Có giải thích chi tiết cho từng đáp án',
            ].map((item, i) => (
              <li key={i} style={styles.introListItem}>
                <Check size={17} color="#22c55e" style={{ flexShrink: 0 }} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <button onClick={onStart} style={{ ...styles.startBtn, background: quiz.color }}>
            <Play size={18} fill="#fff" color="#fff" />
            Bắt đầu làm bài
          </button>
        </div>
      </div>
    </div>
  );
}

// =============================================
// MÀN HÌNH LÀM BÀI
// =============================================
function QuizScreen({ quiz, onFinish, onBack }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const q = quiz.questions[currentIndex];
  const hasAnswered = answers[currentIndex] !== undefined;
  const ans = answers[currentIndex];
  const progress = Math.round((currentIndex / quiz.questions.length) * 100);

  const handleSelect = (idx) => {
    if (hasAnswered) return;
    setAnswers({ ...answers, [currentIndex]: { selected: idx, isCorrect: q.options[idx].isCorrect } });
  };

  const handleNext = () => {
    if (currentIndex < quiz.questions.length - 1) setCurrentIndex(currentIndex + 1);
    else onFinish(answers);
  };

  return (
    <div style={styles.page}>
      <div style={styles.quizWrap}>
        <div style={styles.quizTopBar}>
          <button onClick={onBack} style={styles.backBtnSmall}>
            <ChevronLeft size={16} /> {quiz.title}
          </button>
          <span style={styles.quizCountLabel}>{currentIndex + 1} / {quiz.questions.length}</span>
        </div>

        <div style={styles.progressWrap}>
          <div style={styles.progressBg}>
            <div style={{ ...styles.progressFill, width: `${progress}%`, background: quiz.color }} />
          </div>
          <span style={styles.progressPct}>{progress}%</span>
        </div>

        <div style={styles.questionCard}>
          <div style={{ padding: '1.5rem' }}>
            <h2 style={styles.questionText}>{q.question}</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {q.options.map((opt, i) => {
                const isSel = hasAnswered && ans.selected === i;
                const isRight = opt.isCorrect;
                let s = { ...styles.optionBtn };
                if (hasAnswered) {
                  if (isRight) s = { ...s, borderColor: '#22c55e', background: '#f0fdf4', color: '#14532d', fontWeight: 600 };
                  else if (isSel) s = { ...s, borderColor: '#ef4444', background: '#fef2f2', color: '#7f1d1d' };
                  else s = { ...s, borderColor: '#f1f5f9', background: '#f8fafc', color: '#94a3b8', opacity: 0.6 };
                }
                return (
                  <button key={i} onClick={() => handleSelect(i)} disabled={hasAnswered} style={s}>
                    <span style={{ flex: 1, textAlign: 'left' }}>{opt.text}</span>
                    {hasAnswered && isRight && <CheckCircle2 size={20} color="#16a34a" style={{ flexShrink: 0 }} />}
                    {hasAnswered && isSel && !isRight && <XCircle size={20} color="#dc2626" style={{ flexShrink: 0 }} />}
                  </button>
                );
              })}
            </div>

            {hasAnswered && (
              <div style={{
                ...styles.feedbackBox,
                background: ans.isCorrect ? '#f0fdf4' : '#fef2f2',
                borderColor: ans.isCorrect ? '#bbf7d0' : '#fecaca',
              }}>
                <div style={{ flexShrink: 0, marginTop: 2 }}>
                  {ans.isCorrect ? <CheckCircle2 size={24} color="#16a34a" /> : <XCircle size={24} color="#dc2626" />}
                </div>
                <div>
                  <p style={{ fontWeight: 700, marginBottom: 4, color: ans.isCorrect ? '#166534' : '#991b1b', fontSize: '1rem' }}>
                    {ans.isCorrect ? 'Chính xác!' : 'Sai rồi!'}
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.65, margin: 0 }}>{q.explanation}</p>
                </div>
              </div>
            )}
          </div>

          <div style={styles.questionFooter}>
            {hasAnswered ? (
              <button onClick={handleNext} style={{ ...styles.nextBtn, background: quiz.color }}>
                {currentIndex < quiz.questions.length - 1
                  ? <><span>Câu tiếp theo</span><ArrowRight size={17} /></>
                  : <><span>Xem kết quả</span><CheckCircle2 size={17} /></>}
              </button>
            ) : (
              <span style={styles.hintText}>Vui lòng chọn một đáp án để tiếp tục</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================
// MÀN HÌNH KẾT QUẢ
// =============================================
function ResultScreen({ quiz, answers, onRestart, onHome }) {
  const qs = quiz.questions;
  const correct = Object.values(answers).filter(a => a.isCorrect).length;
  const pct = Math.round((correct / qs.length) * 100);
  const wrong = qs.filter((_, i) => !answers[i]?.isCorrect);
  const scoreColor = pct >= 80 ? '#16a34a' : pct >= 50 ? '#d97706' : '#dc2626';

  return (
    <div style={{ ...styles.page, paddingTop: '2.5rem', paddingBottom: '3rem' }}>
      <div style={styles.resultWrap}>
        <div style={styles.scoreCard}>
          <h2 style={styles.scoreTitle}>Hoàn thành bài thi!</h2>
          <p style={{ color: '#64748b', marginBottom: '1.25rem' }}>{quiz.title}</p>

          <div style={{ position: 'relative', display: 'inline-flex', marginBottom: '1.25rem' }}>
            <svg viewBox="0 0 36 36" style={{ width: 140, height: 140 }}>
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none" stroke="#f1f5f9" strokeWidth="3" />
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none" stroke={scoreColor} strokeWidth="3" strokeDasharray={`${pct}, 100`} />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 700, color: scoreColor }}>{correct}/{qs.length}</span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{pct}%</span>
            </div>
          </div>

          <p style={{ fontSize: '1rem', color: '#475569', marginBottom: '2rem' }}>
            {pct >= 80 ? '🎉 Xuất sắc! Bạn nắm kiến thức rất vững.' :
             pct >= 50 ? '👍 Khá tốt! Vẫn còn chỗ có thể cải thiện.' :
             '💪 Đừng nản! Xem lại các câu sai và thử lại nhé.'}
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={onRestart} style={{ ...styles.actionBtn, background: quiz.color }}>
              <RotateCcw size={16} /> Làm lại bài này
            </button>
            <button onClick={onHome} style={styles.actionBtnOutline}>
              <BookOpen size={16} /> Chọn môn khác
            </button>
          </div>
        </div>

        {wrong.length > 0 && (
          <div style={styles.reviewCard}>
            <h3 style={styles.reviewTitle}>
              <AlertCircle size={22} color="#f97316" />
              Các câu trả lời sai ({wrong.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {wrong.map((q) => {
                const qi = qs.findIndex(item => item.id === q.id);
                const uIdx = answers[qi]?.selected;
                return (
                  <div key={q.id} style={{ paddingBottom: '2rem', borderBottom: '1px solid #f1f5f9' }}>
                    <p style={styles.reviewQ}>Câu {qi + 1}: {q.question}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.875rem' }}>
                      {q.options.map((opt, oi) => {
                        const isUser = oi === uIdx;
                        const isRight = opt.isCorrect;
                        let s = { ...styles.reviewOpt };
                        if (isRight) s = { ...s, background: '#dcfce7', borderColor: '#22c55e', color: '#166534', fontWeight: 600 };
                        else if (isUser) s = { ...s, background: '#fee2e2', borderColor: '#ef4444', color: '#991b1b', textDecoration: 'line-through', opacity: 0.75 };
                        return (
                          <div key={oi} style={s}>
                            <span style={{ flex: 1 }}>{opt.text}</span>
                            {isRight && <CheckCircle2 size={16} color="#16a34a" />}
                            {isUser && !isRight && <XCircle size={16} color="#dc2626" />}
                          </div>
                        );
                      })}
                    </div>
                    <div style={styles.explanationBox}>
                      <span style={{ fontWeight: 700, color: '#1e40af', fontSize: '0.8rem' }}>Giải thích: </span>
                      <span style={{ color: '#1e3a8a', fontSize: '0.85rem', lineHeight: 1.6 }}>{q.explanation}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================
// ROOT APP
// =============================================
export default function App() {
  const [screen, setScreen] = useState('home');
  const [selectedQuiz, setSelectedQuiz] = useState(null); // Lưu bộ đề gốc đã chọn
  const [activeQuiz, setActiveQuiz] = useState(null);     // Lưu bộ đề SAU KHI ĐÃ TRỘN
  const [finalAnswers, setFinalAnswers] = useState({});

  return (
    <>
      {screen === 'home' && (
        <HomePage 
          onSelectQuiz={(q) => { 
            setSelectedQuiz(q); 
            setFinalAnswers({}); 
            setScreen('intro'); 
          }} 
        />
      )}
      
      {screen === 'intro' && (
        <IntroScreen 
          quiz={selectedQuiz} 
          onStart={() => {
            // Khi bấm bắt đầu, tạo ra một bản sao đã trộn ngẫu nhiên
            setActiveQuiz(shuffleQuiz(selectedQuiz));
            setScreen('quiz');
          }} 
          onBack={() => setScreen('home')} 
        />
      )}
      
      {screen === 'quiz' && (
        <QuizScreen 
          quiz={activeQuiz} 
          onFinish={(a) => { 
            setFinalAnswers(a); 
            setScreen('result'); 
          }} 
          onBack={() => setScreen('intro')} 
        />
      )}
      
      {screen === 'result' && (
        <ResultScreen 
          quiz={activeQuiz} 
          answers={finalAnswers} 
          onRestart={() => { 
            // Khi bấm làm lại, trộn lại đề một lần nữa và vào thẳng trang thi
            setFinalAnswers({}); 
            setActiveQuiz(shuffleQuiz(selectedQuiz));
            setScreen('quiz');
            window.scrollTo(0, 0);
          }} 
          onHome={() => { 
            setSelectedQuiz(null); 
            setActiveQuiz(null);
            setScreen('home'); 
          }} 
        />
      )}
    </>
  );
}

// =============================================
// STYLES
// =============================================
const styles = {
  page: { minHeight: '100vh', background: '#f1f5f9', fontFamily: "'Segoe UI', system-ui, sans-serif", color: '#1e293b' },

  // Home
  homeHeader: { background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 60%, #3b82f6 100%)', padding: '3rem 1.5rem 4rem', textAlign: 'center' },
  homeHeaderInner: { maxWidth: 600, margin: '0 auto' },
  homeLogoWrap: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, background: 'rgba(255,255,255,0.2)', borderRadius: '1rem', marginBottom: '1rem' },
  homeTitle: { fontSize: '2rem', fontWeight: 800, color: '#fff', margin: '0 0 0.5rem', letterSpacing: '-0.5px' },
  homeSubtitle: { fontSize: '1rem', color: 'rgba(255,255,255,0.8)', margin: 0 },
  homeContent: { maxWidth: 960, margin: '-2rem auto 0', padding: '0 1.25rem 3rem' },
  cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '2rem' },
  card: { background: '#fff', borderRadius: '1rem', border: 'none', cursor: 'pointer', textAlign: 'left', overflow: 'hidden', transition: 'transform 200ms ease, box-shadow 200ms ease', padding: 0 },
  cardAccent: { height: 5 },
  cardBody: { padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' },
  cardIconWrap: { width: 52, height: 52, borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cardIcon: { fontSize: '1.6rem' },
  cardTitle: { fontSize: '1.05rem', fontWeight: 700, color: '#1e293b', margin: '0 0 0.3rem' },
  cardDesc: { fontSize: '0.82rem', color: '#64748b', margin: 0, lineHeight: 1.5 },
  cardFooter: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.25rem' },
  cardBadge: { fontSize: '0.78rem', fontWeight: 600, padding: '0.25rem 0.625rem', borderRadius: 999 },
  cardBtn: { display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.375rem 0.875rem', borderRadius: 999 },
  homeHint: { textAlign: 'center', color: '#94a3b8', fontSize: '0.82rem', lineHeight: 1.6 },
  code: { background: '#f1f5f9', padding: '1px 5px', borderRadius: 4, fontFamily: 'monospace', color: '#475569', fontSize: '0.8rem' },

  // Intro
  introCard: { background: '#fff', borderRadius: '1.25rem', boxShadow: '0 4px 24px rgba(0,0,0,0.09)', width: '100%', maxWidth: 480, overflow: 'hidden', margin: '2rem 1rem' },
  introBody: { padding: '1.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' },
  backBtn: { display: 'flex', alignItems: 'center', gap: '0.25rem', alignSelf: 'flex-start', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.875rem', padding: '0.25rem 0', marginBottom: '1.25rem' },
  introIconWrap: { width: 72, height: 72, borderRadius: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' },
  introIcon: { fontSize: '2.25rem' },
  introTitle: { fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', margin: '0 0 0.5rem' },
  introDesc: { fontSize: '0.9rem', color: '#64748b', margin: '0 0 1.5rem', lineHeight: 1.6 },
  introList: { listStyle: 'none', padding: 0, margin: '0 0 1.75rem', width: '100%', display: 'flex', flexDirection: 'column', gap: '0.625rem', textAlign: 'left' },
  introListItem: { display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.9rem', color: '#334155' },
  startBtn: { display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', fontWeight: 700, fontSize: '1rem', padding: '0.75rem 2rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer', width: '100%', justifyContent: 'center' },

  // Quiz
  quizWrap: { maxWidth: 660, margin: '0 auto', padding: '1.5rem 1rem 3rem' },
  quizTopBar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' },
  backBtnSmall: { display: 'flex', alignItems: 'center', gap: '0.2rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.875rem' },
  quizCountLabel: { fontSize: '0.875rem', fontWeight: 600, color: '#475569' },
  progressWrap: { display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' },
  progressBg: { flex: 1, height: 8, background: '#e2e8f0', borderRadius: 999, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 999, transition: 'width 0.4s ease' },
  progressPct: { fontSize: '0.8rem', fontWeight: 600, color: '#64748b', minWidth: 32, textAlign: 'right' },
  questionCard: { background: '#fff', borderRadius: '1rem', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', overflow: 'hidden' },
  questionText: { fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', lineHeight: 1.65, marginBottom: '1.25rem' },
  optionBtn: { display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.875rem 1rem', background: '#fff', border: '2px solid #e2e8f0', borderRadius: '0.75rem', cursor: 'pointer', textAlign: 'left', fontSize: '0.95rem', color: '#1e293b', transition: 'all 150ms ease' },
  feedbackBox: { display: 'flex', gap: '0.875rem', marginTop: '1.25rem', padding: '1rem 1.125rem', borderRadius: '0.75rem', border: '1px solid' },
  questionFooter: { padding: '0.875rem 1.5rem', background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end' },
  nextBtn: { display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', fontWeight: 600, padding: '0.6rem 1.25rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontSize: '0.95rem' },
  hintText: { color: '#94a3b8', fontSize: '0.85rem', fontStyle: 'italic', padding: '0.6rem 0' },

  // Result
  resultWrap: { maxWidth: 720, margin: '0 auto', padding: '0 1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  scoreCard: { background: '#fff', borderRadius: '1rem', padding: '2rem', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' },
  scoreTitle: { fontSize: '1.75rem', fontWeight: 800, color: '#1e293b', margin: '0 0 0.25rem' },
  actionBtn: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#fff', fontWeight: 600, padding: '0.625rem 1.25rem', borderRadius: '0.625rem', border: 'none', cursor: 'pointer', fontSize: '0.9rem' },
  actionBtnOutline: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#475569', fontWeight: 600, padding: '0.625rem 1.25rem', borderRadius: '0.625rem', border: '2px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: '0.9rem' },
  reviewCard: { background: '#fff', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' },
  reviewTitle: { display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.15rem', fontWeight: 700, color: '#1e293b', margin: '0 0 1.5rem' },
  reviewQ: { fontWeight: 700, fontSize: '1rem', color: '#1e293b', marginBottom: '0.75rem' },
  reviewOpt: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 0.875rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#475569', fontSize: '0.9rem' },
  explanationBox: { background: '#eff6ff', borderLeft: '4px solid #3b82f6', padding: '0.75rem 1rem', borderRadius: '0 0.5rem 0.5rem 0', lineHeight: 1.6 },
};
