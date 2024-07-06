import book from "../models/book.js"
import review from "../models/review.js";

export async function getAllBooks(req, res) {
    try {
        const books = await book.findAll();
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error!!" });
    }
}

export async function addBook(req, res) {
    try {

        const foundBook = await book.findOne({ where: req.body });
        if (foundBook) {
            return res.json({ message: "Book Already Found!!" });
        }

        const newBook = await book.create(req.body);
        res.json({ message: "Book Added Successfully!" });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error!!" });
    }
}

export async function getBooksByISBN(req, res) {
    try {

        const { ISBN } = req.body;

        if (!ISBN) {
            return res.json({ message: "Please, provide a valid ISBN Code!" });
        }

        const foundBooks = await book.findAll({ where: { ISBN } });
        if (foundBooks.length) {
            return res.json({ message: "Books are Found!!", foundBooks });
        }

        res.json({ message: "No book found with this ISBN Code!" });
    } catch (error) {

        res.status(500).json({ message: "Internal Server Error!!" });

    }
}

export async function getBooksByTitle(req, res) {
    try {

        const { title } = req.body;

        if (!title) {
            return res.json({ message: "Please, provide a valid title!" });
        }

        const foundBooks = await book.findAll({ where: { title } });
        if (foundBooks.length) {
            return res.json({ message: "Books are Found!!", foundBooks });
        }

        res.json({ message: "No book found with this title!" });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error!!" });
    }
}

export async function getBooksByAuthor(req, res) {
    try {

        const { author } = req.body;

        if (!author) {
            return res.json({ message: "Please, provide a valid author name!" });
        }

        const foundBooks = await book.findAll({ where: { author } });
        if (foundBooks.length) {
            return res.json({ message: "Books are Found!!", foundBooks });
        }

        res.json({ message: "No book found with this author name!" });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error!!" });
    }
}


export async function addReview(req, res) {
    try {
        // data to be stored
        const { user_id } = req.user;
        const book_id = req.params.id;
        const { review_text } = req.body;
        // console.log(user_id, book_id, review_text);

        // check if the review is found or not to decide to create a new one or update the existing one
        const foundReview = await review.findOne({ where: { UserId: user_id, BookId: book_id } })

        if (foundReview) {
            const newReview = await review.update({ review_text }, { where: { UserId: user_id, BookId: book_id } });
            return res.json({ message: `Review added/updated successfully!` });
        }

        // execute adding review operation
        const newReview = await review.create({ UserId: user_id, BookId: book_id, review_text });
        res.json({ message: `Review added/updated successfully!` });
    } catch (error) {

        res.status(500).json({ message: "Internal Server Error!!" });

    }
}

export async function getReview(req, res) {
    try {
        const { id } = req.params;
        const bookReview = await review.findAll({ attributes: ["review_text"], where: { BookId: id } })

        if (!bookReview.length) {
            return res.json({ message: "No review found for this book!" });
        }

        res.json({ message: "review found for this book", bookReview });

    } catch (error) {

        res.status(500).json({ message: "Internal Server Error!!" });

    }
}

export async function deleteReview(req, res) {
    try {

        const { user_id } = req.user;
        const { id } = req.params;

        const deletedReview = await review.destroy({ where: { UserId: user_id, BookId: id } });
        // console.log(deletedReview);

        if (!deletedReview) {
            return res.json({ message: "No review found for that user to delete!" });
        }

        res.json({ message: "review deleted for that user successfully!" });

    } catch (error) {

        res.status(500).json({ message: "Internal Server Error!!" });

    }
}
