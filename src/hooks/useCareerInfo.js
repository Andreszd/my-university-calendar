import { useEffect, useState } from 'react';
import { getCareer } from '../services/careers';

export default function useCareerInfo(code = '') {
  const [career, setCareer] = useState({});
  const [semesters, setSemesters] = useState([]);
  const [semester, setSemester] = useState(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getCareer(code).then((res) => {
      setCareer(res);
      setSemesters(getAllSemesters(res));
      setLoading(false);
    });
  }, [code]);

  const getAllSemesters = (career) => {
    return career.levels.map((lvl, idx) => ({
      ...lvl,
      name: `semester ${idx + 1}`,
    }));
  };

  const getSemesterByLevel = (code) => {
    const res = semesters.filter((semester) => semester.code === code)[0];
    if (res) setSemester(res);
  };

  return { career, semesters, semester, getSemesterByLevel, isLoading };
}
