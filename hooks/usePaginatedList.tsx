import { useEffect, useState, useRef } from 'react';
import { FlatList } from 'react-native';

export const usePaginatedList = <T,>(
    fetchData: (page: number) => Promise<{ data: T[]; numberPage: number }>,
    initialPage: number = 1,
) => {
    const [dataList, setDataList] = useState<T[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [totalPage, setTotalPage] = useState<number>(10);
    const [page, setPage] = useState<number>(initialPage);
    const flatListRef = useRef<FlatList>(null);

    const fetchDataForPage = async (pageNum: number) => {
        try {
            setIsLoading(true);
            const res = await fetchData(pageNum);
            setDataList(res.data);
            setTotalPage(Math.ceil(res.numberPage));
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDataForPage(page);
    }, [page]);

    const scrollToTop = () => {
        if (flatListRef.current) {
            flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
        }
    };

    const handlePageChange = (pageNum: number) => {
        setPage(pageNum);
        scrollToTop();
    };

    const getVisiblePages = (): Array<number> => {
        const pages: Array<number> = [];
        const maxVisiblePages = 3;

        if (totalPage <= maxVisiblePages) {
            for (let i = 1; i <= totalPage; i++) {
                pages.push(i);
            }
        } else if (page === 1) {
            pages.push(1, 2, 3);
        } else if (page === totalPage) {
            pages.push(totalPage - 2, totalPage - 1, totalPage);
        } else {
            pages.push(page - 1, page, page + 1);
        }

        return pages;
    };

    return {
        dataList,
        setDataList,
        isLoading,
        totalPage,
        page,
        flatListRef,
        handlePageChange,
        getVisiblePages,
    };
};
