import React from "react";
import ListeningTestViewBase from "@/app/components/tests/ListeningTestViewBase";

interface TeacherListeningTestViewProps {
  test: any;
}

const TeacherListeningTestView: React.FC<TeacherListeningTestViewProps> = ({ test }) => {
  return <ListeningTestViewBase test={test} mode="teacher" />;
};

export default TeacherListeningTestView; 