import mongoose from 'mongoose';
import 'dotenv/config';

// Database connection function
export const connectDb = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

//
// // ... (districts and departments remain the same)
//
// // Helper functions
// const generateEmail = (name, role, district, dept = '') => {
//     const base = `${name.toLowerCase().replace(/\s+/g, '')}.${role.toLowerCase()}.${district.toLowerCase()}`;
//     return dept
//         ? `${base}.${dept.toLowerCase()}@tn.gov.in`
//         : `${base}@tn.gov.in`;
// };
//
// const generatePhone = () => {
//     return '9' + Math.floor(100000000 + Math.random() * 900000000);
// };
//
// const generateName = (prefix, district, isCollector = false) => {
//     let baseName = isCollector ? `Col ${district}` : `${prefix} Head ${district}`;
//     if (baseName.length > 32) {
//         const availableLength = 32 - (prefix.length + (isCollector ? 4 : 6));
//         const truncatedDistrict = district.substring(0, availableLength);
//         baseName = isCollector ? `Col ${truncatedDistrict}` : `${prefix} Head ${truncatedDistrict}`;
//     }
//     return baseName;
// };
//
// // Function to hash password
// const hashPassword = async (password) => {
//     const salt = await bcrypt.genSalt(10);
//     return await bcrypt.hash(password, salt);
// };
//
// // Main function to create users
// async function createUsers() {
//     try {
//         await connectDb();
//
//         const users = [];
//
//         for (const district of districts) {
//             const hashedPassword = await hashPassword('password'); // Hash the static password
//             const collectorName = generateName('Collector', district, true);
//             const collector = {
//                 name: collectorName,
//                 email: generateEmail('collector', 'collector', district),
//                 password: hashedPassword,
//                 role: 'Collector',
//                 district: district,
//                 phone: generatePhone(),
//             };
//             users.push(collector);
//
//             for (const dept of departments) {
//                 const deptHeadName = generateName(dept, district);
//                 const deptHead = {
//                     name: deptHeadName,
//                     email: generateEmail(dept, 'department_head', district, dept),
//                     password: hashedPassword,
//                     role: 'Department_Head',
//                     department: dept,
//                     district: district,
//                     phone: generatePhone(),
//                 };
//                 users.push(deptHead);
//             }
//         }
//
//         await User.insertMany(users);
//         console.log(`Successfully created ${users.length} users:`);
//         console.log(`- 38 Collectors`);
//         console.log(`- ${38 * 5} Department Heads`);
//
//         const collectorCount = await User.countDocuments({ role: 'Collector' });
//         const deptHeadCount = await User.countDocuments({ role: 'Department_Head' });
//         console.log(`Verification - Collectors: ${collectorCount}, Department Heads: ${deptHeadCount}`);
//
//     } catch (error) {
//         console.error('Error creating users:', error);
//         process.exit(1);
//     } finally {
//         await mongoose.connection.close();
//         console.log('Database connection closed');
//     }
// }
//
// // Execute the function
// createUsers();




//Rev
//PW
//Health
//Edu
//Agri