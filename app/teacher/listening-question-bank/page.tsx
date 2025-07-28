'use client';

import TeacherLayout from '@/app/components/teacher/layout/TeacherLayout';
import ListeningQuestionBankManager from '@/app/components/teacher/listening-question-bank/list/ListeningQuestionBankManager';

export default function ListeningGeneratorPage() {
  return (
    <TeacherLayout>
      <ListeningQuestionBankManager />
    </TeacherLayout>
  );
}