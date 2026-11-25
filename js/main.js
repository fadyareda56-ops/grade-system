// ==========================================
// الخطوة 2: الكبسلة وحماية البيانات (Class & Encapsulation)
// ==========================================
class Student {
    // الحقول المخفية (Private Fields)
    #grade1;
    #grade2;
    #grade3;
    #attendance;

    constructor(name, grade1, grade2, grade3, attendance) {
        if (!name || name.trim() === "") {
            throw new Error("يرجى إدخال اسم الطالب بشكل صحيح.");
        }
        this.name = name.trim();
        
        // استدعاء الـ Setters للتحقق من صحة البيانات وتخزينها
        this.grade1 = grade1;
        this.grade2 = grade2;
        this.grade3 = grade3;
        this.attendance = attendance;
    }

    // دالة مساعدة للتحقق من صحة الأرقام (من 0 إلى 100 وغير فارغة)
    #validateScore(value, fieldName) {
        if (value === "" || value === null || isNaN(value)) {
            throw new Error(`حقل "${fieldName}" لا يمكن أن يكون فارغاً.`);
        }
        const num = Number(value);
        if (num < 0 || num > 100) {
            throw new Error(`قيمة "${fieldName}" يجب أن تكون بين 0 و 100.`);
        }
        return num;
    }

    // Setters & Getters
    set grade1(val) {
        this.#grade1 = this.#validateScore(val, "درجة المادة الأولى");
    }
    get grade1() {
        return this.#grade1;
    }

    set grade2(val) {
        this.#grade2 = this.#validateScore(val, "درجة المادة الثانية");
    }
    get grade2() {
        return this.#grade2;
    }

    set grade3(val) {
        this.#grade3 = this.#validateScore(val, "درجة المادة الثالثة");
    }
    get grade3() {
        return this.#grade3;
    }

    set attendance(val) {
        this.#attendance = this.#validateScore(val, "نسبة الحضور");
    }
    get attendance() {
        return this.#attendance;
    }

    // حساب متوسط درجات الطالب
    getAverage() {
        return (this.#grade1 + this.#grade2 + this.#grade3) / 3;
    }
}

// ==========================================
// الخطوة 3: التفاعل مع الشاشة واصطياد الأخطاء (DOM & Try/Catch)
// ==========================================
const studentsList = [];

// الإمساك بعناصر الشاشة
const nameInput = document.getElementById("studentName");
const grade1Input = document.getElementById("grade1");
const grade2Input = document.getElementById("grade2");
const grade3Input = document.getElementById("grade3");
const attendanceInput = document.getElementById("attendance");

const addStudentBtn = document.getElementById("addStudentBtn");
const mercyBtn = document.getElementById("mercyBtn");

const errorBox = document.getElementById("errorBox");
const studentsListBox = document.getElementById("studentsListBox");
const reportBox = document.getElementById("reportBox");

// دالة لعرض الطلاب المسجلين على الشاشة
function renderStudentsList() {
    if (studentsList.length === 0) {
        studentsListBox.innerHTML = `<p class="text-muted text-center my-3">لم يتم إضافة طلاب بعد.</p>`;
        return;
    }

    studentsListBox.innerHTML = studentsList.map((student, index) => `
        <div class="student-item d-flex justify-content-between align-items-center">
            <div>
                <strong>${index + 1}. ${student.name}</strong>
                <div class="small text-muted">الحضور: ${student.attendance}%</div>
            </div>
            <span class="badge bg-primary rounded-pill">المتوسط: ${student.getAverage().toFixed(2)}</span>
        </div>
    `).join("");
}

// حدث الضغط على زر "إضافة طالب"
addStudentBtn.onclick = function () {
    // إخفاء رسالة الخطأ السابقة إن وجدت
    errorBox.classList.add("d-none");
    errorBox.textContent = "";

    try {
        // محاولة إنشاء كائن طالب جديد (سيفعل الـ Setters تلقائياً)
        const newStudent = new Student(
            nameInput.value,
            grade1Input.value,
            grade2Input.value,
            grade3Input.value,
            attendanceInput.value
        );

        // إضافة الطالب للمصفوفة وتحديث الشاشة
        studentsList.push(newStudent);
        renderStudentsList();

        // تفريغ الحقول بعد النجاح
        nameInput.value = "";
        grade1Input.value = "";
        grade2Input.value = "";
        grade3Input.value = "";
        attendanceInput.value = "";

    } catch (error) {
        // اصطياد الخطأ وعرضه في صندوق الأخطاء باللون الأحمر
        errorBox.textContent = error.message;
        errorBox.classList.remove("d-none");
    }
};

// ==========================================
// الخطوة 4: لجنة الرأفة (Filter, Map, Reduce & Template Literals)
// ==========================================
mercyBtn.onclick = function () {
    // 1. Filter: استخراج الطلاب الذين يقع متوسط درجاتهم بين 40 و 49 (شامل الكسور حتى أقل من 50)
    const strugglingStudents = studentsList.filter(student => {
        const avg = student.getAverage();
        return avg >= 40 && avg <= 49;
    });

    // التحقق من وجود طلاب متعثرين لمنع القسمة على صفر
    if (strugglingStudents.length === 0) {
        reportBox.innerHTML = `
            <div class="alert alert-secondary mb-0 text-center">
                لا يوجد طلاب متعثرون (متوسطهم بين 40 و 49) يستحقون درجات الرأفة حالياً.
            </div>
        `;
        return;
    }

    // 2. Map: إضافة 5 درجات رأفة لمتوسط كل طالب متعثر
    const updatedStudents = strugglingStudents.map(student => {
        return {
            name: student.name,
            oldAvg: student.getAverage(),
            newAvg: student.getAverage() + 5
        };
    });

    // 3. Reduce: جمع المتوسطات الجديدة ثم القسمة على العدد
    const totalNewAverages = updatedStudents.reduce((sum, item) => sum + item.newAvg, 0);
    const overallAverageAfterMercy = totalNewAverages / updatedStudents.length;

    // 4. الطباعة على الشاشة باستخدام Template Literals ${}
    const studentsNamesList = updatedStudents
        .map(s => `<li><strong>${s.name}</strong> (من ${s.oldAvg.toFixed(1)} إلى <span class="text-success fw-bold">${s.newAvg.toFixed(1)}</span>)</li>`)
        .join("");

    reportBox.innerHTML = `
        <div class="p-2">
            <p class="mb-2"><strong>عدد الطلاب المستفيدين من الرأفة:</strong> <span class="badge bg-warning text-dark">${updatedStudents.length}</span></p>
            <p class="mb-1"><strong>أسماء الطلاب وتعديل درجاتهم:</strong></p>
            <ul class="mb-3">${studentsNamesList}</ul>
            <div class="alert alert-info mb-0">
                <strong>المتوسط العام للدرجات بعد الرأفة:</strong> ${overallAverageAfterMercy.toFixed(2)}
            </div>
        </div>
    `;
};