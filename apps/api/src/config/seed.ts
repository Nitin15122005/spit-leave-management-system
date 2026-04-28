import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const SALT_ROUNDS = 10;

  // ============================================
  // SEED USERS (matching frontend DEMO_USERS)
  // ============================================
  const users = [
    {
      uid: '2023800110',
      name: 'Nitin Sharma',
      role: Role.student,
      password: '2023800110',
      class: 'TE',
      mobile: '9876543210',
      email: 'nitin.sharma@spit.ac.in',
    },
    {
      uid: '2023800119',
      name: 'Anuj Singh',
      role: Role.student,
      password: '2023800119',
      class: 'TE',
      mobile: '2023800119',
      email: 'anujsingh3672@gmail.com',
    },
    {
      uid: 'TEACHER001',
      name: 'Prof. Rajesh Kumar',
      role: Role.teacher,
      password: 'TEACHER001',
      department: 'Computer Science',
      email: 'rajesh.kumar@spit.ac.in',
    },
    {
      uid: 'HOD001',
      name: 'Dr. Meera Singh',
      role: Role.hod,
      password: 'HOD001',
      department: 'Computer Science',
      email: 'meera.singh@spit.ac.in',
    },
    {
      uid: 'DEAN001',
      name: 'Dr. Sanjay Gupta',
      role: Role.dean,
      password: 'DEAN001',
      email: 'sanjay.gupta@spit.ac.in',
    },
    {
      uid: 'COORD001',
      name: 'Prof. Anjali Sharma',
      role: Role.coordinator,
      password: 'COORD001',
      department: 'Computer Science',
      email: 'anjali.sharma@spit.ac.in',
    },
  ];

  for (const u of users) {
    const hashed = await bcrypt.hash(u.password, SALT_ROUNDS);
    await prisma.user.upsert({
      where: { uid: u.uid },
      update: {},
      create: { ...u, password: hashed },
    });
    console.log(`  ✓ ${u.role.padEnd(12)} ${u.uid} (${u.name})`);
  }

  // ============================================
  // SEED SUBJECTS  (must match StudentDashboard.js subjectsBySemester)
  // ============================================
  const subjects = [
    // Semester 1
    { code: 'CS101', name: 'Programming Fundamentals' },
    // Semester 2
    { code: 'CS201', name: 'Data Structures' },
    // Semester 3
    { code: 'CS301', name: 'Database Systems' },
    // Semester 4
    { code: 'CS401', name: 'Software Engineering' },
    // Semester 5
    { code: 'CS331', name: 'Business Analytics with Python' },
    { code: 'CS307', name: 'Machine Learning' },
    { code: 'CS306', name: 'Human Machine Interaction' },
    { code: 'CS332', name: 'Big Data Analytics' },
    { code: 'CE312', name: 'Deep Learning' },
    { code: 'CS321', name: 'Natural Language Processing' },
    // Semester 6
    { code: 'CS601', name: 'Artificial Intelligence' },
    // Semester 7
    { code: 'CS701', name: 'Cyber Security' },
    // Semester 8
    { code: 'CS801', name: 'Project Work' },
    // Legacy codes still referenced in seeded leave application
    { code: 'CS308', name: 'DevOps Lab' },
  ];

  for (const s of subjects) {
    await prisma.subject.upsert({ where: { code: s.code }, update: {}, create: s });
    console.log(`  ✓ Subject: ${s.code} ${s.name}`);
  }


  // ============================================
  // SEED DEMO LEAVE APPLICATION
  // ============================================
  const student = await prisma.user.findUnique({ where: { uid: '2023800110' } });

  if (student) {
    const existing = await prisma.leaveApplication.findFirst({
      where: { studentId: student.id },
    });

    if (!existing) {
      await prisma.leaveApplication.create({
        data: {
          studentId: student.id,
          studentName: student.name,
          studentUid: student.uid,
          studentClass: student.class ?? 'TE',
          studentMobile: student.mobile ?? '',
          eventName: 'National Technical Symposium',
          organizedBy: 'CSI Student Chapter',
          venue: 'Main Auditorium',
          eventLink: 'https://example.com/event',
          proofLink: 'https://drive.google.com/sample-certificate',
          eventDurationFrom: new Date('2024-01-15'),
          eventDurationTo: new Date('2024-01-16'),
          leaveDatesFrom: new Date('2024-01-15'),
          leaveDatesTo: new Date('2024-01-16'),
          semester: 5,
          totalTheory: 2,
          totalLab: 1,
          status: 'pending_teacher',
          declaration: true,
          subjects: {
            create: [
              {
                subject: { connect: { code: 'CS321' } },
                subjectCode: 'CS321',
                subjectName: 'Natural Language Processing',
                theoryCount: 2,
                labCount: 0,
                classes: {
                  create: [
                    { date: new Date('2024-01-15'), timing: '10:00 AM - 11:00 AM', type: 'theory' },
                    { date: new Date('2024-01-16'), timing: '10:00 AM - 11:00 AM', type: 'theory' },
                  ],
                },
              },
              {
                subject: { connect: { code: 'CS308' } },
                subjectCode: 'CS308',
                subjectName: 'DevOps Lab',
                theoryCount: 0,
                labCount: 1,
                classes: {
                  create: [
                    { date: new Date('2024-01-15'), timing: '2:00 PM - 5:00 PM', type: 'lab', batch: 'A' },
                  ],
                },
              },
            ],
          },
        },
      });
      console.log('  ✓ Demo leave application created');
    }
  }

  console.log('\n✅ Seeding complete!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
