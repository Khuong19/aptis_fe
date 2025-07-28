'use client';

import TeacherLayout from '@/app/components/teacher/layout/TeacherLayout';
import EnhancedQuestionBankManager from '@/app/components/teacher/question-bank/list/EnhancedQuestionBankManager';

export default function QuestionBankPage() {
  return (
    <TeacherLayout>
      <EnhancedQuestionBankManager />
    </TeacherLayout>
  );
}
