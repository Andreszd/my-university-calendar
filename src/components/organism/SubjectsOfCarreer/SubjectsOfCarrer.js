import HeaderSubjects from '../../molecules/HeaderSubjects';
import AccordionSubject from '../AccordionSubject';
import Input from '../../atoms/Input';

import useCareer from '../../../hooks/useCareer';

import './SubjectsOfCareer.css';

export default function SubjectsOfCarrer({ isShowing, setShow }) {
  const { semesters, semester, getSemesterByLevel } = useCareer();

  const onChange = (evt) => getSemesterByLevel(evt.target.value);

  return (
    <>
      <HeaderSubjects isShowing={isShowing} setShow={setShow} />
      <Input
        type="select"
        defaultOption="Levels"
        onChange={onChange}
        hasFullWidth={true}>
        {semesters.map(({ code, name }, idx) => (
          <option key={idx} value={code}>
            {name}
          </option>
        ))}
      </Input>
      <div className="subjects__content">
        {semester?.subjects?.map((subject) => (
          <AccordionSubject subject={subject} key={subject.code} />
        ))}
      </div>
    </>
  );
}
